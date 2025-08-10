import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bot, MessageSquare, FileText, Calendar, User, Building, Type, X, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { documentDraftingService } from './documentDraftingService';

const DocumentHistoryView = ({ sessionId, onClose, onBack }) => {
  const [documentData, setDocumentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  useEffect(() => {
    const fetchDocumentHistory = async () => {
      try {
        setIsLoading(true);
        const data = await documentDraftingService.getDocumentHistory(sessionId);
        setDocumentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchDocumentHistory();
    }
  }, [sessionId]);

  const copyToClipboard = async (text, section = null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedSection(section);
      setTimeout(() => {
        setCopied(false);
        setCopiedSection(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading document history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="text-red-500 mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">{error}</p>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Document History
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {documentData.title || 'Untitled Document'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)]">
          {/* Left Panel - Document Info */}
          <div className="w-full lg:w-1/3 p-6 border-r border-gray-200 dark:border-neutral-800 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Document Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Title:</span>
                    <span className="text-sm font-medium">{documentData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Client:</span>
                    <span className="text-sm font-medium">{documentData.client || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Author:</span>
                    <span className="text-sm font-medium">{documentData.author || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Type:</span>
                    <span className="text-sm font-medium">{documentData.type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Created:</span>
                    <span className="text-sm font-medium">{formatDate(documentData.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Updated:</span>
                    <span className="text-sm font-medium">{formatDate(documentData.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {documentData.conditions && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Conditions</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{documentData.conditions}</p>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Bot size={18} />
                    AI Generated Document Content
                  </h3>
                  <button
                    onClick={() => copyToClipboard(documentData.aiContent || '', 'left')}
                    className="p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    title="Copy AI content"
                  >
                    {copied && copiedSection === 'left' ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-green-600" />}
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto bg-white dark:bg-neutral-800 rounded-lg p-3 border border-green-300 dark:border-green-700">
                  {documentData.aiContent ? (
                    <div className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {documentData.aiContent}
                    </div>
                  ) : (
                    <div className="text-sm text-green-600 dark:text-green-300 italic">
                      No AI content generated yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat History and AI Content */}
          <div className="w-full lg:w-2/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* AI Generated Content Section */}
              {documentData.aiContent && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                      <Bot size={20} />
                      AI Generated Document
                    </h3>
                    <button
                      onClick={() => copyToClipboard(documentData.aiContent, 'right')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                      title="Copy AI content"
                    >
                      {copied && copiedSection === 'right' ? <Check size={14} /> : <Copy size={14} />}
                      {copied && copiedSection === 'right' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-green-300 dark:border-green-700 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {documentData.aiContent}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat History Section */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Conversation History
                  <span className="text-sm text-gray-500 font-normal">
                    ({documentData.chatHistory?.length || 0} messages)
                  </span>
                </h3>

                {documentData.chatHistory && documentData.chatHistory.length > 0 ? (
                  <div className="space-y-4">
                    {documentData.chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.role === 'user' ? (
                              <User size={14} />
                            ) : (
                              <Bot size={14} className="text-green-600" />
                            )}
                            <span className="text-xs font-medium">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp ? formatDate(message.timestamp) : ''}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No conversation history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentHistoryView; 