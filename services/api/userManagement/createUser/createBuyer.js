import API from '../../config';

// The API.js request interceptor will handle getting and setting the token automatically.
// Make sure to use the same token key (`accessToken` or `admin_auth_token`) consistently.
export const createBuyer = async (buyerData) => {
  try {
    const response = await API.post('/users', {
      ...buyerData,
      role: 'buyer' // Force buyer role
    });

    // The global interceptor has already returned response.data.
    // Destructure to remove sensitive data before returning.
    const { password, ...safeData } = response;
    return safeData;

  } catch (error) {
    // The error caught here is the formatted, standardized error from the
    // API.js interceptor. It will have already handled a 401 error.

    // You can re-throw the error for the front-end to display.
    throw error;
  }
};