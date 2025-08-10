import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/chat`;

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export const aiAssistanceHistoryService = {
  getUserSessions: async () => {
    const response = await axios.get(`${API_URL}/sessions`, getAuthHeader());
    return response.data;
  },
  clearUserHistory: async () => {
    const response = await axios.delete(`${API_URL}/sessions`, getAuthHeader());
    return response.data;
  },
  deleteSessionById: async (sessionId) => {
    const response = await axios.delete(`${API_URL}/sessions/${sessionId}`, getAuthHeader());
    return response.data;
  }
}; 