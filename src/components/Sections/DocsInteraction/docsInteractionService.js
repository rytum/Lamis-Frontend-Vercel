import axios from 'axios';

const API_BASE_URL = '/api/document-interaction';

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Document Sessions Management
export const docsInteractionService = {
  // Get all document sessions
  async getSessions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document sessions:', error);
      throw error;
    }
  },

  // Get a specific document session
  async getSession(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/session/${sessionId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document session:', error);
      throw error;
    }
  },

  // Delete a document session
  async deleteSession(sessionId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/session/${sessionId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting document session:', error);
      throw error;
    }
  },

  // Upload a document and create a new session
  async uploadDocument(file, documentName) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', documentName);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Send a chat message for a document
  async sendMessage(documentId, message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        documentId,
        message
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get document chat history
  async getDocumentChat(documentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${documentId}/chat`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document chat:', error);
      throw error;
    }
  }
};

export default docsInteractionService; 