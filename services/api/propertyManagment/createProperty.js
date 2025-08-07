import API from '../config'

// Creating a new property
export const createProperty = async (propertyData) => {
  const formData = new FormData();

  // Required fields
  formData.append('title', propertyData.title);
  formData.append('address', propertyData.address);
  formData.append('price', propertyData.price);

  // Optional fields
  if (propertyData.description) {
    formData.append('description', propertyData.description);
  }

  // Handle image uploads (array of File objects)
  if (propertyData.images?.length > 0) {
    propertyData.images.forEach((image) => {
      formData.append('images[]', image); // Field name must match backend expectation
    });
  }

  try {
    // Override default headers for multipart/form-data
    const response = await API.post('/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Critical for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create property error:', error.response?.data || error.message);
    throw error; // Re-throw for handling in the UI
  }
};
