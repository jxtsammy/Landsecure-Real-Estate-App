import API from '../../config';

// Create Seller
export const createSeller = async (sellerData) => {
  try {
    const response = await API.post(
      '/users',
      {
        ...sellerData,
        role: 'seller' // Force seller role
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        }
      }
    );

    // Return clean seller data (remove sensitive fields)
    const { password, ...safeData } = response.data;
    return safeData;

  } catch (error) {
    // Only handle critical errors (frontend handles validation)
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Admin privileges required');
    }

    if (error.message === 'Network Error') {
      throw new Error('Network connection failed');
    }

    // For all other errors, assume frontend will handle gracefully
    throw new Error('Seller creation failed. Please try again.');
  }
};


//Seller Activation
export const updateSellerStatus = async (userId, { isActive, pendingVerification }) => {
  // Basic validation
  if (!userId || typeof isActive !== 'boolean') {
    throw new Error('Invalid user ID or status');
  }

  try {
    const response = await API.put(
      `/users/${userId}`,
      {
        is_active: isActive,
        pending_verification: pendingVerification
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );

    // Handle success
    if (response.status === 200) {
      return response.data;
    }

    // Handle specific error responses
    if (response.status === 401) {
      throw new Error('Admin authorization required');
    }

    if (response.status === 403) {
      throw new Error('Your account lacks permissions');
    }

    if (response.status === 404) {
      throw new Error('User not found');
    }

    throw new Error(response.data?.message || 'Failed to update user status');

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed');
    }

    // Re-throw processed errors
    if ([
      'Invalid user ID or status',
      'Admin authorization required',
      'Your account lacks permissions',
      'User not found'
    ].includes(error.message)) {
      throw error;
    }

    // Default error
    throw new Error('Failed to update user. Please try again.');
  }
};