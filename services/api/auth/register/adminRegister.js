import API from '../../config';

export const registerSeller = async (userData) => {
  try {
    const response = await API.post(
      '/auth/register',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );

    // Handle success (2xx)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Handle specific error responses
    if (response.status === 400) {
      throw new Error(response.data?.message || 'Invalid registration data');
    }
    if (response.status === 409) {
      throw new Error('Email already registered');
    }

    throw new Error(response.data?.message || 'Registration failed');

  } catch (error) {
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed');
    }
    throw error; // Re-throw other errors
  }
};