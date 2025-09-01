import API from '../config'

export const getProperties = async () => {
  try {
    const response = await API.get(`/properties/?limit=10`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error.response?.data || error.message);
    throw error; // Re-throw for handling in the UI
  }
};