import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://land-secure-backend.onrender.com',
  timeout: 10000,
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

// Enhanced response interceptor
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Format error message
    const errorMessage = error.response?.data?.message ||
                       error.message ||
                       'Request failed';

    // Log detailed error info
    console.error('API Error:', {
      message: errorMessage,
      endpoint: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle specific cases
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('accessToken');
      // Optionally redirect to login
    }

    return Promise.reject(errorMessage);
  }
);

export default API;