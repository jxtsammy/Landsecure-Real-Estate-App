import API from '../../config';

// Create Seller
export const createSeller = async (sellerData) => {
  try {
    // The global API instance automatically handles headers and authorization.
    const response = await API.post(
      '/users',
      {
        ...sellerData,
        role: 'seller' // Force seller role
      }
    );

    // The response interceptor has already returned response.data
    // so we can destructure directly from 'response'.
    const { password, ...safeData } = response;
    return safeData;

  } catch (error) {
    // The error caught here is the formatted, standardized error message
    // from the API.js interceptor.
    throw error;
  }
};

// Seller Activation
export const updateSellerStatus = async (userId, { isActive, pendingVerification }) => {
  // Basic validation is good to keep here
  if (!userId || typeof isActive !== 'boolean') {
    throw new Error('Invalid user ID or status');
  }

  try {
    // The global API instance automatically handles headers and error status.
    const response = await API.put(
      `/users/${userId}`,
      {
        is_active: isActive,
        pending_verification: pendingVerification
      }
    );

    // The response interceptor has already returned response.data.
    return response;

  } catch (error) {
    // The error caught here is the formatted, standardized error from the
    // API.js interceptor.
    throw error;
  }
};