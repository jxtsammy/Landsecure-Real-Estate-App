import API from '../../config';

//Forgot Password Email
export const requestPasswordReset = async (email) => {
  try {
    // No validation - assumes frontend already validated
    await API.post(
      '/auth/forgot-password',
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true // Never throw on response status
      }
    );

    // Always return success (security best practice)
    return true;

  } catch (error) {
    // Only handle network-level errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Check your connection.');
    }
    // For API errors, still return "success" (security best practice)
    return true;
  }
};

// Creating New Password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.post(
      '/auth/reset-password',
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Password-Reset': 'true' // Special header if needed
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx
      }
    );

    // Handle token errors
    if (response.status === 400 || response.status === 401) {
      throw new Error('Invalid or expired reset link');
    }

    // Success (2xx status)
    return true;

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network error. Please check your connection.');
    }

    // Re-throw processed errors
    if (error.message.includes('Invalid or expired')) {
      throw error;
    }

    // Unknown errors
    throw new Error('Password reset failed. Please try again.');
  }
};