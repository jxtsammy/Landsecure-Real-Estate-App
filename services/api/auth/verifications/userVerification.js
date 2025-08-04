import API from '../../config'

//Email Verification
export const verifyAdminEmail = async (token) => {
  // Basic token validation
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid verification token');
  }

  try {
    const response = await API.get('/auth/verify-email', {
      params: { token },
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': 'admin' // Explicitly indicate admin verification
      }
    });

    // Validate response structure
    if (response.data?.statusCode !== 0 || !response.data?.data?.access_token) {
      throw new Error('Unexpected verification response');
    }

    return {
      accessToken: response.data.data.access_token,
      refreshToken: response.data.data.refresh_token,
      accessExpiresIn: parseInt(response.data.data.expires_in_access, 10) || 3600,
      refreshExpiresIn: parseInt(response.data.data.expires_in_refresh, 10) || 86400
    };

  } catch (error) {
    let errorMessage = 'Email verification failed';

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Invalid or expired token';
          break;
        case 404:
          errorMessage = 'Verification token not found';
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


// Resending Email Verification
export const resendVerificationEmail = async (email) => {
  // Basic email validation
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Please enter a valid email address');
  }

  try {
    const response = await API.post(
      '/auth/resend-verification',
      { email },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      }
    );

    // Handle different success responses
    if (response.status === 200 || response.status === 202) {
      return true;
    }

    // Handle specific error responses
    if (response.status === 404) {
      throw new Error('Email not found in our system');
    }

    if (response.status === 429) {
      throw new Error('Please wait before requesting another verification email');
    }

    throw new Error(response.data?.message || 'Failed to resend verification');

  } catch (error) {
    // Network errors
    if (error.message === 'Network Error') {
      throw new Error('Network connection failed. Please check your internet');
    }

    // Re-throw already processed errors
    if (
      error.message.includes('Email not found') ||
      error.message.includes('Please wait')
    ) {
      throw error;
    }

    // Default error
    throw new Error('Failed to resend verification email. Please try again later');
  }
};