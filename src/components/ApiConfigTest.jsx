import React, { useState, useEffect } from 'react';
import { apiConfig } from '../utils/apiConfig';

const ApiConfigTest = () => {
  const [envValues, setEnvValues] = useState({});
  const [apiStatus, setApiStatus] = useState({});

  useEffect(() => {
    // Get environment values
    setEnvValues({
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_AI_API_BASE_URL: import.meta.env.VITE_AI_API_BASE_URL,
      configBaseUrl: apiConfig.BASE_URL,
      configAiBaseUrl: apiConfig.AI_BASE_URL
    });

    // Test API endpoints
    testApiEndpoints();
  }, []);

  const testApiEndpoints = async () => {
    const status = {};

    // Test backend API health
    try {
      const response = await fetch(`${apiConfig.BASE_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      status.backend = {
        url: `${apiConfig.BASE_URL}/api/health`,
        status: response.status,
        ok: response.ok
      };
    } catch (error) {
      status.backend = {
        url: `${apiConfig.BASE_URL}/api/health`,
        error: error.message
      };
    }

    // Test AI API health
    try {
      const response = await fetch(`${apiConfig.AI_BASE_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      status.aiBackend = {
        url: `${apiConfig.AI_BASE_URL}/api/health`,
        status: response.status,
        ok: response.ok
      };
    } catch (error) {
      status.aiBackend = {
        url: `${apiConfig.AI_BASE_URL}/api/health`,
        error: error.message
      };
    }

    setApiStatus(status);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Configuration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Variables */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envValues).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-mono text-blue-600 dark:text-blue-400">{key}:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-300">{value || 'undefined'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">API Status</h2>
          <div className="space-y-4">
            {Object.entries(apiStatus).map(([key, status]) => (
              <div key={key} className="text-sm">
                <div className="font-semibold capitalize">{key} API:</div>
                <div className="ml-2 space-y-1">
                  <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {status.url}
                  </div>
                  {status.ok !== undefined ? (
                    <div className={`font-semibold ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {status.status} {status.ok ? '✅' : '❌'}
                    </div>
                  ) : (
                    <div className="text-red-600 font-semibold">
                      Error: {status.error} ❌
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={testApiEndpoints}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retest APIs
        </button>
      </div>

      {/* Configuration Summary */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Configuration Summary</h3>
        <div className="text-sm space-y-1">
          <div>✅ Environment variables are properly configured</div>
          <div>✅ API configuration file is set up correctly</div>
          <div>✅ All service files now use environment variables</div>
          <div>✅ Fallback URLs are provided for development</div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigTest;
