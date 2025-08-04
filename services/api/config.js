import axios from 'axios';

const API = axios.create({
  baseURL: 'https://land-secure-backend.onrender.com', // Base URL (no double slashes)
  timeout: 10000,
});

// Request interceptor (add auth token if needed)
API.interceptors.request.use((config) => {
  const token = 'YOUR_TOKEN'; // Replace with AsyncStorage later
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (global error handling)
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export default API;