import API from '../../config'

import AsyncStorage from '@react-native-async-storage/async-storage';
//Get User Config
export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  // Validate pagination parameters
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

  try {
    const response = await API.get('/users', {
      params: { page, limit },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.users)) {
      throw new Error('Invalid server response format');
    }

    return {
      users: response.data.users,
      totalPages: response.data.totalPages || Math.ceil(response.data.totalCount / limit),
      currentPage: page
    };

  } catch (error) {
    let errorMessage = 'Failed to fetch users';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Authentication required';
          break;
        case 403:
          errorMessage = 'Insufficient permissions';
          break;
        case 404:
          errorMessage = 'No users found';
          break;
        default:
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network connection failed';
    }

    throw new Error(errorMessage);
  }
};

// Helper to get auth token
const getAuthToken = async () => {
  return AsyncStorage.getItem('accessToken');
};





//Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await API.get('/users/me', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });

    // Validate response structure
    if (!response.data?.id || !response.data?.email) {
      throw new Error('Invalid profile data received');
    }

    return response.data;

  } catch (error) {
    let errorMessage = 'Failed to fetch profile';
    console.log('Error fetching profile:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Session expired - Please login again';
          break;
        case 404:
          errorMessage = 'User profile not found';
          break;
        default:
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network connection failed';
    } else if (error.message.includes('Invalid profile data')) {
      errorMessage = 'Server returned incomplete profile';
    }

    throw new Error(errorMessage);
  }
};


//Update User Profile
export const updateUserProfile = async (updates) => {
  // Basic validation - ensure at least one field is provided
  if (!updates || Object.keys(updates).length === 0) {
    throw new Error('No updates provided');
  }

  try {
    const response = await API.put(
      '/users/me',
      updates,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
    if (response.status === 400) {
      throw new Error(response.data?.message || 'Invalid update data');
    }

    if (response.status === 403) {
      throw new Error('Role modification not permitted');
    }

    throw new Error(response.data?.message || 'Update failed');

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed');
    }

    // Re-throw processed errors
    if ([
      'No updates provided',
      'Invalid update data',
      'Role modification not permitted'
    ].includes(error.message)) {
      throw error;
    }

    // Default error
    throw new Error('Profile update failed. Please try again.');
  }
};


//Delete User Profile
export const deleteUser = async (userId) => {
  // Basic validation
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  try {
    const response = await API.delete(
      `/users/${userId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getAdminAuthToken()}`
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );

    // Handle success
    if (response.status === 204) {
      return true;
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

    throw new Error(response.data?.message || 'Deletion failed');

  } catch (error) {
    let errorMessage = 'Failed to delete user';

    if (error.message === 'Network Error') {
      errorMessage = 'Network connection failed';
    }

    // Re-throw processed errors
    if ([
      'Invalid user ID',
      'Admin authorization required',
      'Your account lacks permissions',
      'User not found'
    ].includes(error.message)) {
      throw error;
    }

    throw new Error(errorMessage);
  }
};

// Admin-specific token helper
const getAdminAuthToken = async () => {
  const token = await AsyncStorage.getItem('@admin_auth_token');
  if (!token) throw new Error('Admin authentication required');
  return token;
};

// User Logout
export const userLogout = async (refreshToken) => {
  // Basic validation
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('Invalid refresh token');
  }

  try {
    const response = await API.post(
      '/auth/logout',
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );

    // Handle success (typically 200 or 204)
    if (response.status === 200 || response.status === 204) {
      return true;
    }

    // Handle specific error responses
    if (response.status === 400) {
      throw new Error('Invalid or expired refresh token');
    }

    if (response.status === 401) {
      throw new Error('Session already expired');
    }

    throw new Error(response.data?.message || 'Logout failed');

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet');
    }

    // Re-throw processed errors
    if ([
      'Invalid refresh token',
      'Invalid or expired refresh token',
      'Session already expired'
    ].includes(error.message)) {
      throw error;
    }

    // Default error
    throw new Error('Logout service unavailable. Please try later.');
  }
};