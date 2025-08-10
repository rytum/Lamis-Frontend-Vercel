import React from 'react';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { usePopup } from '../../../contexts/PopupContext';

const Sidebar = ({ sessions, currentSession, onSessionSelect, onNewChat, onClearHistory, onDeleteSession, style }) => {
  const { isProfilePopupOpen } = usePopup();
  
  return (
    <div 
      className={`flex flex-col w-64 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white p-3 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 z-30 ${
        isProfilePopupOpen ? 'blur-sm' : ''
      }`} 
      style={{
        ...style,
        height: '100vh',
        top: 0
      }}
    >
      {/* New Chat Button */}
      <button 
        onClick={onNewChat}
        className="flex items-center justify-start gap-3 p-2.5 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors duration-200 font-medium mb-4 text-sm mt-8"
      >
        <Plus size={18} />
        <span>New Chat</span>
      </button>
      
      <div className="border-t border-gray-200 dark:border-neutral-800 my-2" />

      {/* History Section */}
      <span className="text-xs text-gray-400 font-semibold mb-2 mt-2 px-2 tracking-wider">
        HISTORY
      </span>
      
      {/* Chat List */}
      <div className="flex-grow overflow-y-auto -mr-2 pr-2 custom-scrollbar"> {/* Professional scrollbar */}
        <ul className="mt-2 space-y-1">
          {sessions?.length === 0 ? (
            <li className="text-center text-gray-500 dark:text-neutral-500 text-sm mt-4 px-2">
              No recent chats
            </li>
          ) : (
            sessions?.map((session) => (
              <li 
                key={session.sessionId}
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors duration-200 ${
                  currentSession?.sessionId === session.sessionId
                    ? 'bg-purple-600/20 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 font-medium' // Active state
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-200/70 dark:hover:bg-neutral-800/60' // Inactive state
                }`}
              >
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0"
                  onClick={() => onSessionSelect(session)}
                >
                  <MessageSquare className="flex-shrink-0" size={16} />
                  <span className="truncate text-sm">{session.title || 'New Chat'}</span>
                </div>
                {/* Delete button for individual chat */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session);
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                  title="Delete this chat"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* Clear History Button */}
      {sessions?.length > 0 && (
        <button
          onClick={onClearHistory}
          className="flex items-center justify-start gap-3 p-2.5 rounded-lg border border-red-400 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 font-medium mt-4 text-sm"
        >
          <X size={16} />
          <span>Clear History</span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;