import API from '../../config';

export const createSeller = async (sellerData) => {
  try {
    const response = await API.post('/auth/register', {
      ...sellerData,
      role: 'seller'
    });

    const { password, ...safeData } = response;
    return safeData;

  } catch (error) {
    throw error;
  }
};
