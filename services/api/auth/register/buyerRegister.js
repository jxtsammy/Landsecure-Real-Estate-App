import API from '../../config';

export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);

    return response.data;

  } catch (error) {
    console.error("User registration failed:", error);

    throw error;
  }
};
