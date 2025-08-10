import axios from 'axios';

const API_BASE_URL = '/api/documents';

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Document Drafting Service
export const documentDraftingService = {
  // Get all drafting sessions
  async getDraftingSessions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/drafting-sessions`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching drafting sessions:', error);
      throw error;
    }
  },

  // Get a specific drafting session
  async getSession(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/session/${sessionId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching drafting session:', error);
      throw error;
    }
  },

  // Get document history with full AI content and chat history
  async getDocumentHistory(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/${sessionId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document history:', error);
      throw error;
    }
  },

  // Update a drafting session
  async updateSession(sessionId, data) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/session/${sessionId}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating drafting session:', error);
      throw error;
    }
  },

  // Send chat message to drafting assistant
  async sendChatMessage(message, context) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`, 
        { message, context },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  // Generate document
  async generateDocument(formData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate`, 
        formData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  },

  // Save document
  async saveDocument(documentData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}`,
        documentData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  },

  // Delete a drafting session
  async deleteSession(sessionId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/session/${sessionId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting drafting session:', error);
      throw error;
    }
  }
};

export default documentDraftingService;
