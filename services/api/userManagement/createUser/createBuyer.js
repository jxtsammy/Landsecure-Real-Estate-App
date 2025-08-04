import API from '../../config'

//Create Buyer
export const createBuyer = async (buyerData) => {
  try {
    const response = await API.post(
      '/users',
      {
        ...buyerData,
        role: 'buyer' // Force buyer role
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      }
    );

    // Remove sensitive data before returning
    const { password, ...safeData } = response.data;
    return safeData;

  } catch (error) {
    // Handle critical errors only
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Authorization required - Please login again');
    }

    if (error.message === 'Network Error') {
      throw new Error('Network connection failed');
    }

    // For all other errors, use generic message
    throw new Error('Buyer creation failed. Please try again.');
  }
};

// Helper to get auth token
const getAuthToken = async () => {
  return AsyncStorage.getItem('admin_auth_token');
};