import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, BookOpen, Plus, Library, FileText, Users, LogOut, Trash2, X } from 'lucide-react';
import DocsInteractionSidebar from './DocsInteractionSidebar';

const DocsInteractionDrawer = ({ open, onClose, onNewChat, onDeleteSession, onClearHistory, sessions, currentSession, onSessionSelect }) => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { label: 'AI Assistance', icon: Star, path: '/ai-assistance' },
    { label: 'Docs Interaction', icon: BookOpen, path: '/docs-interaction/upload' },
    { label: 'Documents Drafting', icon: Plus, path: '/documents-drafting' },
    { label: 'Vault', icon: Library, path: '/vault' },
  ];

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

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div
      className={`fixed inset-0 z-30 transition-transform transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative flex h-full max-w-xs w-full bg-white dark:bg-neutral-900 shadow-xl">
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
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
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Features
              </h3>
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const isActive = isActiveNavItem(item.path);
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat History Section */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Document Chats
                </h3>
                <DocsInteractionSidebar
                  sessions={sessions}
                  currentSession={currentSession}
                  onSessionSelect={onSessionSelect}
                  onNewChat={onNewChat}
                  onClearHistory={onClearHistory}
                  onDeleteSession={onDeleteSession}
                />
              </div>
            </div>
          </div>

          {/* User Section */}
          {user && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsInteractionDrawer; 