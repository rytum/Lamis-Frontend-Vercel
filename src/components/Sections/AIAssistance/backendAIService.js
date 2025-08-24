// Backend AI Service - Uses AI API directly since backend is not accessible
import axios from 'axios';

const API_BASE_URL = 'https://backend.lamis.ai';
const AI_API_URL = 'https://aibackend.lamis.ai/api/query';
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

// Direct AI API call - Primary method since AI API is working
const callAIAPI = async (message) => {
  try {
    console.log('Calling AI API directly:', AI_API_URL);
    console.log('Request payload:', { query: message, include_ai_response: true, include_graphs: true });
    
    const response = await axios.post(AI_API_URL, {
      query: message,
      include_ai_response: true,
      include_graphs: true
    }, { 
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('AI API response received:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data keys:', Object.keys(response.data || {}));
    
    return response.data;
  } catch (error) {
    console.error('AI API call failed:', error?.response?.status || error.message);
    if (error?.response?.data) {
      console.error('Error details:', error.response.data);
    }
    if (error?.response?.headers) {
      console.error('Response headers:', error.response.headers);
    }
    if (error?.code === 'ECONNABORTED') {
      console.error('Request timed out');
    }
    if (error?.code === 'ERR_NETWORK') {
      console.error('Network error - possible CORS issue');
    }
    throw new Error('AI service unavailable');
  }
};

export const backendAIService = {
  // Start a new chat session - Frontend-only since backend is not accessible
  startSession: async (title = 'New Chat') => {
    // Create frontend session since backend is not accessible
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    return {
      sessionId,
      title,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      success: true
    };
  },

  // Send a message - Use AI API directly since backend is not accessible
  sendMessage: async (sessionId, message) => {
    try {
      // Call AI API directly since backend is not accessible
      const aiResponse = await callAIAPI(message);
      console.log('AI API call successful');
      
      return {
        userMessage: {
          message,
          sender: 'user',
          meta: { role: 'user' },
          timestamp: new Date().toISOString()
        },
        assistantMessage: {
          message: aiResponse.answer || 'No response available',
          sender: 'assistant',
          meta: { role: 'assistant' },
          timestamp: new Date().toISOString()
        },
        aiResponse: {
          answer: aiResponse.answer || 'No response available',
          query: message,
          success: aiResponse.success || true,
          ...(aiResponse.case_analytics && { case_analytics: aiResponse.case_analytics }),
          ...(aiResponse.case_downloads && { case_downloads: aiResponse.case_downloads }),
          ...(aiResponse.case_summaries && { case_summaries: aiResponse.case_summaries }),
          ...(aiResponse.processing_time && { processing_time: aiResponse.processing_time }),
          ...(aiResponse.sources && { sources: aiResponse.sources })
        },
        session: { session_id: sessionId }
      };
    } catch (error) {
      console.error('AI API call failed:', error);
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
  },

  // Get chat history - Frontend-only since backend is not accessible
  getChatHistory: async (sessionId) => {
    console.log('Frontend-only mode: No backend history available');
    return [];
  },

  // Get all user sessions - Frontend-only since backend is not accessible
  getUserSessions: async () => {
    console.log('Frontend-only mode: No backend sessions available');
    return [];
  },

  // Clear all chat sessions - Frontend-only since backend is not accessible
  clearAllSessions: async () => {
    console.log('Frontend-only mode: Sessions cleared from frontend only');
    return { success: true };
  },

  // Delete a specific session - Frontend-only since backend is not accessible
  deleteSession: async (sessionId) => {
    console.log('Frontend-only mode: Session deleted from frontend only');
    return { success: true };
  }
};