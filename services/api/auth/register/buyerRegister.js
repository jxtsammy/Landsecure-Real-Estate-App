import API from '../../config';

export const registerUser = async (userData) => {
  try {
    // The global API instance handles headers and error status by default.
    // The interceptor will also return `response.data`.
    const response = await API.post('/auth/register', userData);

    return response;

  } catch (error) {
    // The error caught here is the formatted, standardized error from the
    // API.js interceptor.

    // You can simply re-throw this error so your front-end component can
    // catch and display it.
    throw error;
  }
};