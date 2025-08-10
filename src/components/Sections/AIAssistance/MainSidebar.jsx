import React from 'react';
import { Star, BookOpen, Plus, Library, FileText, Users, ChevronLeft, ChevronRight, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { usePopup } from '../../../contexts/PopupContext';

// Updated navItems list to match new requirements
const navItems = [
  { label: 'AI Assistance', icon: Star, path: '/ai-assistance' },
  { label: 'Docs Interaction', icon: BookOpen, path: '/docs-interaction/upload' },
  { label: 'Documents Drafting', icon: Plus, path: '/documents-drafting' },
  { label: 'Vault', icon: Library, path: '/vault' },
];

// Helper function to get the first initial of the user's name for the avatar
const getInitial = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase();
};

const MainSidebar = ({ expanded, setExpanded }) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const { isProfilePopupOpen, setIsProfilePopupOpen } = usePopup();

  // Close popup when clicking outside
  const popupRef = React.useRef(null);
  React.useEffect(() => {
    if (!isProfilePopupOpen) return;
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsProfilePopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfilePopupOpen, setIsProfilePopupOpen]);

  // Theme options with icons
  const themeOptions = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
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

  return (
    // Main container with transition for width
    <div
      className={`flex flex-col h-screen bg-white/90 dark:bg-neutral-950/90 text-gray-900 dark:text-white border-r border-gray-200 dark:border-neutral-800 fixed left-0 top-0 z-50 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}
      style={{ 
        minWidth: expanded ? 256 : 64,
        height: '100vh',
        top: 0
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Expand/Collapse button positioned at the right edge */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-60">
        <button
          style={{ width: 36, height: 36 }}
          className="flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shadow-lg"
          tabIndex={0}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          type="button"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex flex-col h-full w-full">
        {/* Logo section at the top */}
        <div className="flex items-center px-2 py-2">
          <button
            className={`flex items-center gap-3 p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full ${expanded ? '' : 'justify-center'}`}
            onClick={() => navigate('/')}
          >
            <img
              src="/lamis-symbol-light-mode.png"
              alt="Lamis Symbol"
              className="h-6 w-6 object-contain dark:hidden"
            />
            <img
              src="/lamis-symbol-dark-mode.png"
              alt="Lamis Symbol"
              className="h-6 w-6 object-contain hidden dark:block"
            />
            {expanded && (
              <span className="text-base font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                Lamis.AI
              </span>
            )}
          </button>
        </div>
        
        {/* Navigation Items section */}
        <div className="flex flex-col gap-2 px-2 flex-grow">
          {navItems.map((item) => {
            const isActive = isActiveNavItem(item.path);
            return (
              <button
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-full transition w-full group ${
                  expanded ? '' : 'justify-center'
                } ${
                  isActive 
                    ? 'bg-gray-600 text-white shadow-lg hover:bg-gray-700' 
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200'
                }`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <item.icon 
                  size={22} 
                  className={`transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                  }`}
                />
                {expanded && (
                  <span className={`text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
          {/* User Profile button integrated into the nav list */}
          {isAuthenticated && !isLoading && (
            <button
              className={`flex items-center gap-3 p-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition w-full ${expanded ? '' : 'justify-center'} mt-auto`}
              aria-label="User profile"
              type="button"
              onClick={() => setIsProfilePopupOpen(true)}
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
        {/* Remove Logout Button section at the very bottom */}
      </div>
             {/* Profile Popup Modal */}
       {isProfilePopupOpen && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
           <div ref={popupRef} className="backdrop-blur-md rounded-xl shadow-2xl p-8 flex flex-col items-center min-w-[500px] max-w-[600px] w-full mx-4 relative border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-950">
             <button
               className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold mr-3 mt-3"
               onClick={() => setIsProfilePopupOpen(false)}
               aria-label="Close"
             >
               x
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
            <div className="w-full flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 text-center">Theme</label>
              <div className="flex justify-center space-x-4">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                      theme === opt.id 
                        ? 'bg-[#a59ad6] text-white border-purple-400' 
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => changeTheme(opt.id)}
                    title={opt.label}
                  >
                    <opt.icon size={20} />
                  </button>
                ))}
              </div>
            </div>
                         <button
               onClick={() => {
                 if (window.confirm('Are you sure you want to logout?')) {
                   setIsProfilePopupOpen(false);
                   logout({ logoutParams: { returnTo: window.location.origin } });
                 }
               }}
               className="w-full mt-2 px-6 py-3 text-center text-sm font-medium text-[#a59ad6] hover:text-white hover:bg-red-600 dark:hover:bg-red-700 transition rounded-xl"
             >
               Logout
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSidebar;
