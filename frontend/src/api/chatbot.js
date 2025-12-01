import apiClient from './config';

// Chatbot API
export const chatbotAPI = {
  // Search products using natural language
  searchProducts: async message => {
    const response = await apiClient.post('/chatbot/search', { message });
    return response.data;
  },

  // Get popular products for suggestions
  getPopularProducts: async () => {
    const response = await apiClient.get('/chatbot/popular');
    return response.data;
  },
};
