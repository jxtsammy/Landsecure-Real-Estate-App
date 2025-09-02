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


// Seller Login Config
export const loginSeller = async (email, password) => {
  // Basic client-side validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const response = await API.post(
      '/auth/login',
      {
        email: email.trim().toLowerCase(),
        password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );
    console.log("Login response:", response);

    // Handle successful login (2xx status)
    if (response.status >= 200 && response.status < 300) {
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        user: response.data.user,
        expiresIn: response.data.expires_in
      };
    }

    // Handle specific error responses
    if (response.status === 401) {
      throw new Error('Invalid email or password');
    }

    if (response.status === 403) {
      throw new Error('Account not verified. Please check your email');
    }

    throw new Error(response.data?.message || 'Login failed');

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet.');
    }

    // Re-throw processed errors
    if ([
      'Email and password are required',
      'Invalid email or password',
      'Account not verified'
    ].includes(error.message)) {
      throw error;
    }

    // Default error
    throw new Error('Login service unavailable. Please try later.');
  }
};