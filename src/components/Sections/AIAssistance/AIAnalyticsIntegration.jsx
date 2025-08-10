import React, { useState } from 'react';
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';

// This component shows how to integrate analytics charts into your AI Assistance interface
const AIAnalyticsIntegration = ({ aiResponse, onClose }) => {
  const [activeTab, setActiveTab] = useState('answer');

  if (!aiResponse || !aiResponse.case_analytics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="text-center text-gray-500">
          No analytics data available for this response.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Response Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('answer')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'answer'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Answer
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'cases'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Cases
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'answer' && (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {aiResponse.answer}
              </div>
            </div>
            
            {/* Sources */}
            {aiResponse.sources && aiResponse.sources.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Sources</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {aiResponse.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Summary */}
            <CaseAnalyticsSummary 
              caseAnalytics={aiResponse.case_analytics}
              className="mb-6"
            />

            {/* Charts Dashboard */}
            <AnalyticsDashboard 
              caseAnalytics={aiResponse.case_analytics}
              className="space-y-8"
            />
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Related Cases
            </h3>
            
            {aiResponse.case_analytics.graphs.similarity_bar.case_details.map((caseDetail, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {caseDetail.case_name}
                  </h4>
                  <span className="text-sm font-medium text-purple-600">
                    Score: {(caseDetail.similarity_score * 100).toFixed(1)}%
                  </span>
                </div>
                
                {/* Legal Principles */}
                {caseDetail.legal_principles && caseDetail.legal_principles.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Key Legal Principles:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {caseDetail.legal_principles.slice(0, 2).map((principle, pIndex) => (
                        <li key={pIndex} className="text-xs">
                          {principle.length > 150 ? principle.substring(0, 150) + '...' : principle}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topics */}
                {caseDetail.topics && caseDetail.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {caseDetail.topics.map((topic, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Download Link */}
                {caseDetail.download_path && (
                  <div className="mt-3">
                    <a
                      href={caseDetail.download_path}
                      className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline"
                    >
                      Download Case File
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Processing time: {aiResponse.processing_time.toFixed(3)}s</span>
          <span>Query: {aiResponse.query}</span>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsIntegration;