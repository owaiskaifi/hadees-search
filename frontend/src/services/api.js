import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchHadiths = async (query, filters = {}) => {
  try {
    const params = {
      query,
      ...filters,
    };
    const response = await api.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching hadiths:', error);
    throw error;
  }
};

export const answerQuestion = async (question, limit = 5) => {
  try {
    const params = {
      question,
      limit,
    };
    const response = await api.get('/answer', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting answer:', error);
    throw error;
  }
};

export default api; 