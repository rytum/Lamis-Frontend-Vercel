import React, { useState, useEffect } from 'react';
import { testAPIConnectivity, logAPIConfiguration } from '../utils/apiConfig';

const APITestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Log API configuration on component mount
    logAPIConfiguration();
  }, []);

  const runConnectivityTest = async () => {
    setLoading(true);
    try {
      const results = await testAPIConnectivity();
      setTestResults(results);
    } catch (error) {
      console.error('Connectivity test failed:', error);
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            API Configuration Test
          </h1>
          
          {/* Environment Variables Display */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Environment Variables
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 font-mono text-sm">
              <div className="mb-2">
                <span className="font-semibold">VITE_API_BASE_URL:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {import.meta.env.VITE_API_BASE_URL || 'undefined'}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">VITE_AI_API_BASE_URL:</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {import.meta.env.VITE_AI_API_BASE_URL || 'undefined'}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Resolved Backend URL:</span>{' '}
                <span className="text-green-600 dark:text-green-400">
                  {import.meta.env.VITE_API_BASE_URL || 'https://backend.lamis.ai'}
                </span>
              </div>
              <div>
                <span className="font-semibold">Resolved AI Backend URL:</span>{' '}
                <span className="text-green-600 dark:text-green-400">
                  {import.meta.env.VITE_AI_API_BASE_URL || 'https://aibackend.lamis.ai'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={runConnectivityTest}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Testing...' : 'Test API Connectivity'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Test Results
              </h2>
              {testResults.error ? (
                <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md p-4">
                  <div className="text-red-800 dark:text-red-200">
                    Error: {testResults.error}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Backend API Status */}
                  <div className={`p-4 rounded-md border ${
                    testResults.backend.connected
                      ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
                      : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
                  }`}>
                    <div className="font-semibold mb-2">Backend API</div>
                    <div className="text-sm">URL: {testResults.backend.url}</div>
                    <div className={`text-sm font-medium ${
                      testResults.backend.connected
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      Status: {testResults.backend.connected ? '✅ Connected' : '❌ Failed'}
                    </div>
                    {testResults.backend.error && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        Error: {testResults.backend.error}
                      </div>
                    )}
                  </div>

                  {/* AI API Status */}
                  <div className={`p-4 rounded-md border ${
                    testResults.ai.connected
                      ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
                      : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
                  }`}>
                    <div className="font-semibold mb-2">AI Backend API</div>
                    <div className="text-sm">URL: {testResults.ai.url}</div>
                    <div className={`text-sm font-medium ${
                      testResults.ai.connected
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      Status: {testResults.ai.connected ? '✅ Connected' : '❌ Failed'}
                    </div>
                    {testResults.ai.error && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        Error: {testResults.ai.error}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Instructions
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• This page tests the connectivity to your backend and AI backend APIs</li>
              <li>• Environment variables are loaded from your .env file</li>
              <li>• If tests fail, check your .env configuration and API server status</li>
              <li>• Green status means the API is reachable, red means connection failed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestPage;
