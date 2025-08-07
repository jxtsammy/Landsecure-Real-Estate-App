import API from '../config'

export const transferProperty = async (propertyId, transferData) => {
  const formData = new FormData();

  // Required fields
  formData.append('recipientEmail', transferData.recipientEmail);

  // Optional fields
  if (transferData.recipientWalletAddress) {
    formData.append('recipientWalletAddress', transferData.recipientWalletAddress);
  }

  // Append documents if provided
  if (transferData.documents?.length > 0) {
    transferData.documents.forEach((doc, index) => {
      formData.append(`documents[${index}]`, doc);
    });
  }

  try {
    const response = await API.post(
      `/properties/${propertyId}/transfer`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Transfer failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};