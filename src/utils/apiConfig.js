// Central API configuration
// Uses environment variables with secure localhost fallbacks
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_LOCAL_URL || 'http://localhost:5000',
  AI_BASE_URL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:5001',
};

// API endpoints configuration
// All endpoints use the centralized configuration above
export const API_ENDPOINTS = {
  // Backend API endpoints
  BACKEND: {
    BASE: `${API_CONFIG.BASE_URL}/api/auth0`,
    SAVE_USER: `${API_CONFIG.BASE_URL}/api/auth0/save`,
    CHAT_SESSIONS: `${API_CONFIG.BASE_URL}/api/chat/sessions`,
    CHAT_SESSION: `${API_CONFIG.BASE_URL}/api/chat/session`,
    CHAT_MESSAGE: `${API_CONFIG.BASE_URL}/api/chat/message`,
    CHAT_HISTORY: `${API_CONFIG.BASE_URL}/api/chat/history`,
    CHAT_CLEAR: `${API_CONFIG.BASE_URL}/api/chat/clear`,
    VAULT: `${API_CONFIG.BASE_URL}/api/vault`,
    DOCUMENTS: `${API_CONFIG.BASE_URL}/api/documents`,
    DOC_INTERACTION: `${API_CONFIG.BASE_URL}/api/document-interaction`,
    HEALTH: `${API_CONFIG.BASE_URL}/api/health`,
    AUTH: `${API_CONFIG.BASE_URL}/api/auth0`,
  },
  
  // AI Backend API endpoints
  AI: {
    QUERY: `${API_CONFIG.AI_BASE_URL}/api/query`,
    HEALTH: `${API_CONFIG.AI_BASE_URL}/api/health`,
    STATUS: `${API_CONFIG.AI_BASE_URL}/api/status`,
    DOWNLOAD: `${API_CONFIG.AI_BASE_URL}/download`,
  }
};

// Helper function to test API connectivity
export const testAPIConnectivity = async () => {
  const results = {
    backend: { url: API_CONFIG.BASE_URL, connected: false, error: null },
    ai: { url: API_CONFIG.AI_BASE_URL, connected: false, error: null }
  };

  // Test Backend API
  try {
    const response = await fetch(API_ENDPOINTS.BACKEND.HEALTH, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    results.backend.connected = response.ok;
    if (!response.ok) {
      results.backend.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    results.backend.error = error.message;
  }

  // Test AI API
  try {
    const response = await fetch(API_ENDPOINTS.AI.HEALTH, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    results.ai.connected = response.ok;
    if (!response.ok) {
      results.ai.error = `HTTP ${response.status}`;
    }
  } catch (error) {
    results.ai.error = error.message;
  }

  return results;
};

// Helper function to log current configuration
export const logAPIConfiguration = () => {
  console.group('🔧 API Configuration');
  console.log('Backend URL:', API_CONFIG.BASE_URL);
  console.log('AI Backend URL:', API_CONFIG.AI_BASE_URL);
  console.log('Environment Variables:');
  console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('  VITE_AI_API_BASE_URL:', import.meta.env.VITE_AI_API_BASE_URL);
  console.groupEnd();
};
