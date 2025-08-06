import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://land-secure-backend.onrender.com', // Base URL (no double slashes)
  timeout: 10000,
});

// Request interceptor (add auth token if needed)
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // or your specific key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (global error handling)
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export default API;