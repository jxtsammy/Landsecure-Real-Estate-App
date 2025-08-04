import API from '../../config';

export const registerAdmin = async (adminData) => {
  try {
    // Minimal server-side check for critical fields
    if (!adminData?.email || !adminData?.password) {
      throw new Error('Essential fields missing');
    }

    const response = await API.post(
      '/auth/register',
      {
        ...adminData,
        role: 'admin' // Force admin role
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Registration': 'true'
        }
      }
    );

    // Check for expected response structure
    if (!response.data?.user || !response.data?.token) {
      throw new Error('Unexpected server response');
    }

    return response.data;

  } catch (error) {
    // Only handle server/privilege errors (frontend handles validation)
    if (error.response) {
      switch (error.response.status) {
        case 403:
          throw new Error('Admin registration requires elevated privileges');
        case 409:
          throw new Error('Email already registered');
        case 500:
          throw new Error('Server error. Please try later');
        default:
          throw new Error('Registration service unavailable');
      }
    } else {
      throw new Error('Network error. Check your connection');
    }
  }
};