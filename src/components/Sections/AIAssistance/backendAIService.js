// Backend AI Service - Uses backend API for proper database storage
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const FLASK_API_URL = `${import.meta.env.VITE_FLASK_API_URL || 'http://localhost:6000'}/api/query`;
const API_ENDPOINTS = {
  sessions: `${API_BASE_URL}/api/chat/session`,
  messages: `${API_BASE_URL}/api/chat/message`,
  history: `${API_BASE_URL}/api/chat/history`,
  userSessions: `${API_BASE_URL}/api/chat/sessions`,
  clearSessions: `${API_BASE_URL}/api/chat/clear`
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('auth0_token');
};

// Create axios instance with auth headers
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor (no verbose logs in production)
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor - concise error logging only
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      console.error('API error:', error.response.status, error.response.data?.message || error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Direct Flask API call for fallback
const callFlaskAPI = async (message) => {
  try {
    const response = await axios.post(FLASK_API_URL, {
      query: message,
      include_ai_response: true,
      include_graphs: true
    }, { timeout: 60000 });
    return response.data;
  } catch (error) {
    console.error('Flask API fallback failed:', error?.response?.status || error.message);
    throw new Error('AI service unavailable');
  }
};

export const backendAIService = {
  // Start a new chat session using backend API
  startSession: async (title = 'New Chat') => {
    try {
      const response = await apiClient.post('/chat/session', { title });
      const session = response.data;
      return {
        sessionId: session.session_id,
        title: session.title,
        created: session.createdAt,
        lastUpdated: session.updatedAt,
        success: true
      };
    } catch (error) {
      // Fallback to frontend session creation
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      return {
        sessionId,
        title,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        success: true
      };
    }
  },

  // Send a message using backend API
  sendMessage: async (sessionId, message) => {
    try {
      const response = await apiClient.post('/chat/message', { sessionId, message });
      return {
        userMessage: {
          message: response.data.userMessage.message,
          sender: 'user',
          meta: response.data.userMessage.meta,
          timestamp: response.data.userMessage.createdAt
        },
        assistantMessage: {
          message: response.data.assistantMessage.message,
          sender: 'assistant',
          meta: response.data.assistantMessage.meta,
          timestamp: response.data.assistantMessage.createdAt
        },
        aiResponse: {
          answer: response.data.aiResponse.answer,
          query: response.data.aiResponse.query,
          success: response.data.aiResponse.success,
          ...(response.data.aiResponse.case_analytics && { case_analytics: response.data.aiResponse.case_analytics }),
          ...(response.data.aiResponse.case_downloads && { case_downloads: response.data.aiResponse.case_downloads }),
          ...(response.data.aiResponse.case_summaries && { case_summaries: response.data.aiResponse.case_summaries }),
          ...(response.data.aiResponse.sources && { sources: response.data.aiResponse.sources }),
          ...(response.data.aiResponse.processing_time && { processing_time: response.data.aiResponse.processing_time })
        },
        session: response.data.session
      };
    } catch (error) {
      // Fallback to direct Flask API call
      const flaskResponse = await callFlaskAPI(message);
      return {
        userMessage: {
          message,
          sender: 'user',
          meta: { role: 'user' },
          timestamp: new Date().toISOString()
        },
        assistantMessage: {
          message: flaskResponse.answer || 'No response available',
          sender: 'assistant',
          meta: { role: 'assistant' },
          timestamp: new Date().toISOString()
        },
        aiResponse: {
          answer: flaskResponse.answer || 'No response available',
          query: message,
          success: flaskResponse.success || true,
          ...(flaskResponse.case_analytics && { case_analytics: flaskResponse.case_analytics }),
          ...(flaskResponse.case_downloads && { case_downloads: flaskResponse.case_downloads }),
          ...(flaskResponse.case_summaries && { case_summaries: flaskResponse.case_summaries }),
          ...(flaskResponse.processing_time && { processing_time: flaskResponse.processing_time }),
          ...(flaskResponse.sources && { sources: flaskResponse.sources })
        },
        session: { session_id: sessionId }
      };
    }
  },

  // Get chat history from backend
  getChatHistory: async (sessionId) => {
    try {
      const response = await apiClient.get(`/chat/history/${sessionId}`);
      return response.data.messages;
    } catch (error) {
      console.error('Failed to get chat history:', error?.response?.status || error.message);
      return [];
    }
  },

  // Get all user sessions from backend
  getUserSessions: async () => {
    try {
      const response = await apiClient.get('/chat/sessions');
      return response.data.map(session => ({
        sessionId: session.session_id,
        title: session.title,
        created: session.createdAt,
        lastUpdated: session.updatedAt
      }));
    } catch (error) {
      console.error('Failed to get user sessions:', error?.response?.status || error.message);
      return [];
    }
  },

  // Clear all chat sessions
  clearAllSessions: async () => {
    try {
      await apiClient.delete('/chat/clear');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear sessions:', error?.response?.status || error.message);
      throw error;
    }
  },

  // Delete a specific session
  deleteSession: async (sessionId) => {
    try {
      await apiClient.delete(`/chat/session/${sessionId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete session:', error?.response?.status || error.message);
      throw error;
    }
  }
};