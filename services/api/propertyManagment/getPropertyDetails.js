import API from '../config'

export const getPropertyDetails = async (propertyId) => {
  try {
    const response = await API.get(`/properties/${propertyId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error.response?.data || error.message);
    throw error; // Re-throw for handling in the UI
  }
};