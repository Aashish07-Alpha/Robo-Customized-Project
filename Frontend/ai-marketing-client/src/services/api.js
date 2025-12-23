import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI processing
});

/**
 * Generate marketing asset
 * @param {Object} productData - Product details
 * @returns {Promise<Object>} - Generated marketing content
 */
export const generateMarketingAsset = async (productData) => {
  try {
    const response = await apiClient.post('/generate', productData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to generate marketing asset'
    );
  }
};

/**
 * Get marketing history
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Promise<Object>} - Marketing history
 */
export const getMarketingHistory = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch marketing history'
    );
  }
};

/**
 * Health check
 * @returns {Promise<Object>} - Health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('API health check failed');
  }
};

export default {
  generateMarketingAsset,
  getMarketingHistory,
  healthCheck
};
