import React, { useState, useEffect, useRef } from 'react';
import { Star, BookOpen, Plus, Library, FileText, Users, LogOut, Trash2, X, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

const mainNavItems = [
  { label: 'AI Assistance', icon: Star, path: '/ai-assistance' },
  { label: 'Docs Interaction', icon: BookOpen, path: '/docs-interaction/upload' },
  { label: 'Documents Drafting', icon: Plus, path: '/documents-drafting' },
  { label: 'Vault', icon: Library, path: '/vault' },
];

const MergedSidebar = ({ onNewChat, refreshHistory, userId, onDeleteSession, onClearHistory }) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const [history, setHistory] = useState([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const initialHistoryCount = 5;
  const popupRef = useRef(null);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  useEffect(() => {
    const loadHistoryFromLocalStorage = () => {
      try {
        // Load sessions from localStorage
        const savedSessions = localStorage.getItem('lamis_ai_sessions');
        const parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
        
        // Convert to the format expected by this component
        const sessions = parsedSessions.map(session => ({
          id: session.sessionId,
          title: session.title || 'New Chat'
        }));
        
        setHistory(sessions);
      } catch (err) {
        console.error('Error loading chat history from localStorage:', err);
        setHistory([]);
      }
    };
    
    loadHistoryFromLocalStorage();
    
    // Listen for storage changes to update history when sessions are modified
    const handleStorageChange = (e) => {
      if (e.key === 'lamis_ai_sessions') {
        loadHistoryFromLocalStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshHistory]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!isProfilePopupOpen) return;
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsProfilePopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfilePopupOpen]);

  const getInitial = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  const handleDeleteSession = (session) => {
    if (onDeleteSession) {
      // Convert session format to match the main component's expected format
      const sessionToDelete = {
        sessionId: session.id,
        title: session.title
      };
      onDeleteSession(sessionToDelete);
    } else {
      // Frontend-only delete - remove from localStorage
      try {
        const savedSessions = localStorage.getItem('lamis_ai_sessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          const updatedSessions = parsedSessions.filter(s => s.sessionId !== session.id);
          localStorage.setItem('lamis_ai_sessions', JSON.stringify(updatedSessions));
          
          // Remove messages for this session
          localStorage.removeItem(`lamis_ai_messages_${session.id}`);
          
          // Update local state
          setHistory(prev => prev.filter(h => h.id !== session.id));
        }
      } catch (err) {
        console.error('Error deleting session:', err);
      }
    }
  };

  const handleClearHistory = () => {
    if (onClearHistory) {
      onClearHistory();
    } else {
      // Frontend-only clear - remove from localStorage
      try {
        const savedSessions = localStorage.getItem('lamis_ai_sessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions);
          // Remove all message data for each session
          parsedSessions.forEach(session => {
            localStorage.removeItem(`lamis_ai_messages_${session.sessionId}`);
          });
        }
        
        // Clear sessions from localStorage
        localStorage.removeItem('lamis_ai_sessions');
        
        // Update local state
        setHistory([]);
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  // Function to check if a nav item is active
  const isActiveNavItem = (itemPath) => {
    if (itemPath === '/ai-assistance') {
      return location.pathname === '/ai-assistance';
    } else if (itemPath === '/docs-interaction/upload') {
      return location.pathname === '/docs-interaction/upload' || location.pathname === '/upload';
    } else if (itemPath === '/documents-drafting') {
      return location.pathname === '/documents-drafting' || location.pathname === '/document-drafting';
    } else if (itemPath === '/vault') {
      return location.pathname.startsWith('/vault');
    }
    return false;
  };

  const visibleHistory = isHistoryExpanded ? history : history.slice(0, initialHistoryCount);

  return (
    <>
      <div className="flex flex-col h-full bg-white/90 dark:bg-neutral-950/90 text-gray-900 dark:text-white w-full border-r border-gray-200 dark:border-neutral-800 p-4 pt-20 overflow-y-auto custom-scrollbar">
        {/* Logo section at the top */}
        <div className="flex items-center px-2 py-2 mb-4">
          <button
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full"
            onClick={() => navigate('/')}
          >
            <img
              src="/lamis-symbol-light-mode.png"
              alt="Lamis Symbol"
              className="h-6 w-6 object-contain dark:hidden"
            />
            <img
              src="/Lamis-navbar-logo-dark.png"
              alt="Lamis Symbol"
              className="h-6 w-6 object-contain hidden dark:block"
            />
            <span className="text-base font-medium text-gray-700 dark:text-gray-200">
              LAMA AI
            </span>
          </button>
        </div>

        {/* Features Section - First */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Features
          </h2>
          <div className="flex flex-col gap-2">
            {mainNavItems.map((item) => {
              const isActive = isActiveNavItem(item.path);
              return (
                <button 
                  key={item.label} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition w-full ${
                    isActive 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon 
                    size={20} 
                    className={`transition-colors ${
                      isActive 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                  <span className={`text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive 
                      ? 'text-purple-700 dark:text-purple-300' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 my-2"></div>

        {/* Chat History Section - Second */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Chat History
          </h2>
          
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mb-3"
          >
            <span>New Chat</span>
            <Plus size={20} />
          </button>

          <ul className="space-y-1">
            {visibleHistory.map((session, index) => (
              <li key={session.id || index} className="group flex items-center justify-between p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer">
                <span className="text-sm truncate flex-1">{session.title}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session);
                  }}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200"
                  title="Delete this chat"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
          {history.length > initialHistoryCount && (
            <button 
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full text-left px-2 py-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              {isHistoryExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          
          {/* Clear History Button */}
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center justify-start gap-2 p-2 rounded-lg border border-red-400 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 font-medium mt-2 text-sm w-full"
            >
              <X size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>
        
        <div className="flex-grow"></div>

        <div className="p-2 border-t border-gray-200 dark:border-neutral-800">
          {isAuthenticated && !isLoading && user && (
            <button
              onClick={() => setIsProfilePopupOpen(true)}
              className="flex items-center gap-3 p-3 w-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition rounded-lg"
            >
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
              ) : (
                <span className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-base">
                  {getInitial(user.name)}
                </span>
              )}
              <span className="text-base font-medium text-gray-700 dark:text-gray-200 truncate">{user.name}</span>
            </button>
          )}
          {isAuthenticated && !isLoading && (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full"
            >
              <LogOut size={22} />
              <span className="text-base font-medium text-gray-700 dark:text-gray-200">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Popup Modal */}
      {isProfilePopupOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div ref={popupRef} className="backdrop-blur-md shadow-2xl p-6 flex flex-col items-center w-full max-w-sm mx-4 relative border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-950">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold"
              onClick={() => setIsProfilePopupOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            {user && user.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User avatar'}
                className="h-16 w-16 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover mb-2"
              />
            ) : (
              <span className="h-16 w-16 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl border-2 border-gray-300 dark:border-gray-600 mb-2">
                {getInitial(user?.name)}
              </span>
            )}
            <span className="font-semibold text-gray-900 dark:text-white text-lg mt-1 mb-2">{user?.name}</span>
            <span className="text-gray-500 dark:text-gray-300 text-xs mt-0.5 mb-4">LEGAL ASSOCIATE</span>
            
            <div className="w-full flex flex-col gap-2 mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 text-center">Theme</label>
              <div className="flex justify-center space-x-3">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                        theme === opt.id 
                          ? 'bg-purple-600 text-white border-purple-400' 
                          : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700'
                      }`}
                      onClick={() => changeTheme(opt.id)}
                      title={opt.label}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  setIsProfilePopupOpen(false);
                  logout({ logoutParams: { returnTo: window.location.origin } });
                }
              }}
              className="w-full px-6 py-3 text-center text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 transition rounded-xl border border-red-600 hover:border-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MergedSidebar; 