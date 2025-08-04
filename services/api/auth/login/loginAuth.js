// src/api/auth.js
import API from '../../config';

// Buyer Login
export const loginBuyer = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email,
      password,
    });
    return response.data; // { token, user } or similar
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';

    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        errorMessage = 'Invalid email or password';
      }
      else if (error.response.status === 404) {
        errorMessage = 'Account not found'; // New case
      }
      else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }

    throw new Error(errorMessage);
  }
};

// src/api/auth.js
export const loginAdmin = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'admin' // Role specification header
      }
    });
    return response.data; // { token, adminData }
  } catch (error) {
    let errorMessage = 'Admin login failed. Check credentials.';

    if (error.response) {
      // Enhanced status code handling
      if (error.response.status === 401) {
        errorMessage = 'Invalid admin credentials';
      }
      else if (error.response.status === 403) {
        errorMessage = 'Not authorized as admin';
      }
      else if (error.response.status === 404) {
        errorMessage = 'Admin account not found';
      }
      else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network error. Check your connection.';
    }

    throw new Error(errorMessage);
  }
};