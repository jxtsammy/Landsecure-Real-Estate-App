import API from '../../config';

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register',
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data; // Typically returns { user, token }

  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';

    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid registration data';
      }
      else if (error.response.status === 409) {
        errorMessage = 'User already exists';
      }
    }

    throw new Error(errorMessage);
  }
};