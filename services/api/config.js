import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://land-secure-backend.onrender.com',
  timeout: 30000, // Reduced to 30 seconds for most requests
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with token refresh logic
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration and refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // You need to create an API endpoint for token refresh
          const response = await axios.post('https://land-secure-backend.onrender.com/auth`/refresh-token', { refreshToken });
          const { accessToken, newRefreshToken } = response.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update the header and retry the original request
          API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        console.error('Token refresh failed. Logging out...', refreshError);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject('Session expired. Please log in again.');
      }
    }

    // Format and log error message for other errors
    const errorMessage = error.response?.data?.message || error.message || 'Request failed';

    console.error('API Error:', {
      message: errorMessage,
      endpoint: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle other status codes or redirect after token refresh attempts
    if (error.response?.status === 403) {
      return Promise.reject('You do not have permission to perform this action.');
    }

    return Promise.reject(errorMessage);
  }
);

export default API;