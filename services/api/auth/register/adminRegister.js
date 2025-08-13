import API from '../../config';

export const registerSeller = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);

    // The global interceptor will handle success and return response.data
    return response;

  } catch (error) {
    // The global interceptor will have already formatted the error message
    // and rejected the promise. You can catch it here.

    // Example of how you could handle specific messages
    if (error === 'Email already registered') {
        throw new Error('This email is already in use. Please try another.');
    }

    // Re-throw the error received from the interceptor
    throw error;
  }
};