import React from 'react';
import { Clock, FileText, Trash2, X, Bot, MessageSquare, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const DraftingHistorySidebar = ({ 
  isVisible,
  onClose,
  sessions,
  onSessionSelect,
  onDeleteSession,
  onViewHistory,
  isLoading
}) => {
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format time difference for "last updated"
  const getTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };
  
  return (
    <motion.div 
      className={`fixed inset-y-0 right-0 z-40 w-80 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white border-l border-gray-200 dark:border-neutral-800 shadow-lg overflow-hidden ${isVisible ? 'flex' : 'hidden'} flex-col`}
      initial={{ x: "100%" }}
      animate={{ x: isVisible ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock size={20} />
          Draft History
        </h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading draft history...</p>
          </div>
        ) : sessions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FileText size={32} className="text-gray-400 mb-2" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">No draft history</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your previous drafting sessions will appear here
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sessions?.map((session) => (
              <li 
                key={session.sessionId}
                className="group p-3 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer"
                onClick={() => onSessionSelect(session)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm truncate max-w-[180px]">
                      {session.title || "Untitled Document"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.type || "Document"} • {session.client || "No client"}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Updated {getTimeDifference(session.updatedAt)}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewHistory(session.sessionId);
                      }}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                      title="View full history"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.sessionId);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                      title="Delete this drafting session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {session.previewMessage && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-neutral-800 rounded text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    <div className="flex items-center gap-1 mb-1">
                      <MessageSquare size={12} className="text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">User Message:</span>
                    </div>
                    {session.previewMessage}
                  </div>
                )}
                
                {session.aiContentPreview && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-gray-600 dark:text-gray-300 line-clamp-2 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot size={12} className="text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">AI Generated Content:</span>
                    </div>
                    {session.aiContentPreview}
                  </div>
                )}
                
                {session.chatHistoryLength > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {session.chatHistoryLength} message{session.chatHistoryLength !== 1 ? 's' : ''} in conversation
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default DraftingHistorySidebar;
