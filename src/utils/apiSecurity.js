// API Configuration Validator and Security Helper
import { API_CONFIG } from './apiConfig';

// Security validation function to check if URLs are using environment variables
export const validateApiSecurity = () => {
  const issues = [];
  const recommendations = [];

  // Check if environment variables are being used
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const aiBaseUrl = import.meta.env.VITE_AI_API_BASE_URL;
  const localUrl = import.meta.env.VITE_API_BASE_LOCAL_URL;

  if (!baseUrl) {
    issues.push('VITE_API_BASE_URL environment variable is not set');
    recommendations.push('Set VITE_API_BASE_URL in your .env file for production backend');
  }

  if (!aiBaseUrl) {
    issues.push('VITE_AI_API_BASE_URL environment variable is not set');
    recommendations.push('Set VITE_AI_API_BASE_URL in your .env file for AI backend');
  }

  if (!localUrl) {
    recommendations.push('Consider setting VITE_API_BASE_LOCAL_URL for local development fallback');
  }

  // Check if using localhost fallbacks in production
  const isProduction = import.meta.env.PROD;
  if (isProduction && (API_CONFIG.BASE_URL.includes('localhost') || API_CONFIG.AI_BASE_URL.includes('localhost'))) {
    issues.push('Using localhost URLs in production build');
    recommendations.push('Ensure production environment variables are properly set');
  }

  return {
    isSecure: issues.length === 0,
    issues,
    recommendations,
    currentConfig: {
      baseUrl: API_CONFIG.BASE_URL,
      aiBaseUrl: API_CONFIG.AI_BASE_URL,
      isProduction,
      envVars: {
        VITE_API_BASE_URL: baseUrl,
        VITE_AI_API_BASE_URL: aiBaseUrl,
        VITE_API_BASE_LOCAL_URL: localUrl
      }
    }
  };
};

// Function to get appropriate API URLs based on environment
export const getApiUrls = () => {
  const isDevelopment = import.meta.env.DEV;
  
  return {
    backend: {
      base: API_CONFIG.BASE_URL,
      health: `${API_CONFIG.BASE_URL}/api/health`,
      chat: `${API_CONFIG.BASE_URL}/api/chat`,
      vault: `${API_CONFIG.BASE_URL}/api/vault`,
      documents: `${API_CONFIG.BASE_URL}/api/documents`,
      auth: `${API_CONFIG.BASE_URL}/api/auth0`
    },
    ai: {
      base: API_CONFIG.AI_BASE_URL,
      query: `${API_CONFIG.AI_BASE_URL}/api/query`,
      health: `${API_CONFIG.AI_BASE_URL}/api/health`,
      status: `${API_CONFIG.AI_BASE_URL}/api/status`,
      download: `${API_CONFIG.AI_BASE_URL}/download`
    },
    isDevelopment,
    fallbackToLocal: API_CONFIG.BASE_URL.includes('localhost') || API_CONFIG.AI_BASE_URL.includes('localhost')
  };
};

// Function to test API connectivity with security validation
export const testApiConnectivitySecure = async () => {
  const validation = validateApiSecurity();
  const urls = getApiUrls();
  
  const results = {
    security: validation,
    connectivity: {
      backend: { tested: false, accessible: false, error: null },
      ai: { tested: false, accessible: false, error: null }
    },
    timestamp: new Date().toISOString()
  };

  // Test backend connectivity
  try {
    const response = await fetch(urls.backend.health, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    results.connectivity.backend = {
      tested: true,
      accessible: response.ok,
      status: response.status,
      url: urls.backend.health
    };
  } catch (error) {
    results.connectivity.backend = {
      tested: true,
      accessible: false,
      error: error.message,
      url: urls.backend.health
    };
  }

  // Test AI backend connectivity
  try {
    const response = await fetch(urls.ai.health, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    results.connectivity.ai = {
      tested: true,
      accessible: response.ok,
      status: response.status,
      url: urls.ai.health
    };
  } catch (error) {
    results.connectivity.ai = {
      tested: true,
      accessible: false,
      error: error.message,
      url: urls.ai.health
    };
  }

  return results;
};

// Function to log security and configuration status
export const logSecurityStatus = () => {
  const validation = validateApiSecurity();
  
  console.group('🔐 API Security Validation');
  console.log('Security Status:', validation.isSecure ? '✅ SECURE' : '⚠️ ISSUES FOUND');
  
  if (validation.issues.length > 0) {
    console.group('🚨 Security Issues');
    validation.issues.forEach(issue => console.warn('⚠️', issue));
    console.groupEnd();
  }
  
  if (validation.recommendations.length > 0) {
    console.group('💡 Recommendations');
    validation.recommendations.forEach(rec => console.info('💡', rec));
    console.groupEnd();
  }
  
  console.group('🔧 Current Configuration');
  console.log('Backend URL:', validation.currentConfig.baseUrl);
  console.log('AI Backend URL:', validation.currentConfig.aiBaseUrl);
  console.log('Production Mode:', validation.currentConfig.isProduction);
  console.log('Environment Variables:', validation.currentConfig.envVars);
  console.groupEnd();
  
  console.groupEnd();
  
  return validation;
};
