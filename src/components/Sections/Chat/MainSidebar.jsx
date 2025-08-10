import React from 'react';
import { Star, BookOpen, Plus, Library, FileText, Users, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, Link } from 'react-router-dom';

// Updated navItems list to match new requirements
const navItems = [
  { label: 'Docs Interaction', icon: BookOpen },
  { label: 'Documents Drafting', icon: Plus },
  { label: 'AI Assistance', icon: Star },
  { label: 'Voult', icon: Library },
];

// Helper function to get the first initial of the user's name for the avatar
const getInitial = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase();
};

const MainSidebar = ({ expanded, setExpanded }) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const navigate = useNavigate();

  return (
    // Main container with transition for width
    <div
      className={`hidden md:flex flex-col h-screen bg-white/90 dark:bg-neutral-950/90 text-gray-900 dark:text-white border-r border-gray-200 dark:border-neutral-800 fixed left-0 top-0 z-40 pt-16 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}
      style={{ minWidth: expanded ? 256 : 64 }}
    >
      {/* Expand/Collapse button, replacing onMouseEnter/Leave functionality */}
      <div className="flex items-center justify-center pt-4 pb-2">
        <button
          style={{ width: 36, height: 36 }}
          className="flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onClick={() => setExpanded(!expanded)}
          tabIndex={0}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          type="button"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex flex-col h-full w-full">
        {/* Navigation Items section */}
        <div className="flex flex-col gap-2 mt-4 px-2 flex-grow">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full ${expanded ? '' : 'justify-center'}`}
              onClick={item.label === 'Documents Drafting' ? () => navigate('/documents-drafting') : undefined}
            >
              <item.icon size={22} />
              {expanded && (
                <span className="text-base font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.label}
                </span>
              )}
            </button>
          ))}
          
          {/* User Profile button integrated into the nav list */}
          {isAuthenticated && !isLoading && (
            <button
              className={`flex items-center gap-3 p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full ${expanded ? '' : 'justify-center'} mt-auto`}
              aria-label="User profile"
              type="button"
            >
              {user && user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User avatar'}
                  className="h-6 w-6 rounded-full border border-gray-300 dark:border-neutral-700 object-cover"
                  title={user.name}
                />
              ) : (
                <span className="h-6 w-6 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-base border border-gray-300 dark:border-neutral-700">
                  {getInitial(user?.name)}
                </span>
              )}
              {expanded && (
                <span className="text-base font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                  {user?.name}
                </span>
              )}
            </button>
          )}
        </div>
        
        {/* Logout Button section at the very bottom */}
        <div className="p-2 border-t border-gray-200 dark:border-neutral-800">
          {isAuthenticated && !isLoading && (
            <button
              onClick={() => {
                // Clear authentication token
                localStorage.removeItem('token')
                sessionStorage.clear();
                // Proceed with Auth0 logout
                logout({ logoutParams: { returnTo: window.location.origin } });
              }}
              className={`flex items-center gap-3 p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full ${expanded ? '' : 'justify-center'}`}
              aria-label="Logout"
              type="button"
            >
              <LogOut size={22} />
              {expanded && <span className="text-base font-medium text-gray-700 dark:text-gray-200">Logout</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;
