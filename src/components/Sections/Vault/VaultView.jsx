import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { vaultService, VAULT_FOLDERS, FOLDER_NAMES, FOLDER_DESCRIPTIONS } from './vaultService';
import MainSidebar from '../AIAssistance/MainSidebar';
import { Search, Trash2, Eye, Plus, FolderOpen, Calendar, MessageSquare, Move, Folder, X, LogOut, Star, BookOpen, Library } from 'lucide-react';

// Mobile Drawer Component for Vault
const VaultDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth0();
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

  const getInitial = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative flex h-full max-w-xs w-full bg-white/90 dark:bg-neutral-950/90 shadow-xl">
        <div className="flex flex-col w-full h-full border-r border-gray-200 dark:border-neutral-800 p-4 pt-20 overflow-y-auto custom-scrollbar">
          {/* Navigation Section */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Navigation
            </h2>
            {mainNavItems.map((item) => {
              const isActive = isActiveNavItem(item.path);
              return (
                <button 
                  key={item.label} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition w-full ${
                    isActive 
                      ? 'bg-gray-600 text-white shadow-lg hover:bg-gray-700' 
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <item.icon 
                    size={22} 
                    className={`transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  />
                  <span className={`text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="flex-grow"></div>

          {/* User Section */}
          <div className="p-2 border-t border-gray-200 dark:border-neutral-800">
            {isAuthenticated && !isLoading && user && (
              <div className="flex items-center gap-3 p-3 w-full">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-base">
                    {getInitial(user.name)}
                  </span>
                )}
                <span className="text-base font-medium text-gray-700 dark:text-gray-200 truncate">{user.name}</span>
              </div>
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
      </div>
    </div>
  );
};

const VaultView = () => {
  const [vaultedChats, setVaultedChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainSidebarExpanded, setMainSidebarExpanded] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(VAULT_FOLDERS.AI_ASSISTANCE);
  const [folderStats, setFolderStats] = useState({});
  const [showMoveDialog, setShowMoveDialog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Add mobile drawer state
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Load vaulted chats on component mount
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    loadVaultedChats();
    loadFolderStats();
  }, [isAuthenticated, isLoading, navigate, selectedFolder]);

  const loadVaultedChats = async () => {
    try {
      setLoading(true);
      const chats = await vaultService.getVaultedChatsByFolder(selectedFolder);
      setVaultedChats(chats);
    } catch (error) {
      console.error('Failed to load vaulted chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolderStats = async () => {
    try {
      const stats = await vaultService.getFolderStats();
      setFolderStats(stats);
    } catch (error) {
      console.error('Failed to load folder stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVaultedChats();
      return;
    }
    
    try {
      setLoading(true);
      const results = await vaultService.searchVaultedChats(searchQuery, selectedFolder);
      setVaultedChats(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this vaulted chat?')) {
      return;
    }

    try {
      await vaultService.deleteVaultedChat(chatId);
      setVaultedChats(vaultedChats.filter(chat => chat._id !== chatId));
      loadFolderStats();
    } catch (error) {
      console.error('Failed to delete vaulted chat:', error);
      alert('Failed to delete vaulted chat');
    }
  };

  const handleMoveChat = async (chatId, newFolder) => {
    try {
      await vaultService.moveChatToFolder(chatId, newFolder);
      setVaultedChats(vaultedChats.filter(chat => chat._id !== chatId));
      setShowMoveDialog(null);
      loadFolderStats();
    } catch (error) {
      console.error('Failed to move chat:', error);
      alert('Failed to move chat to folder');
    }
  };

  const handleViewChat = async (chat) => {
    try {
      navigate(`/vault/chat/${chat._id}`);
    } catch (error) {
      console.error('Failed to navigate to chat:', error);
      alert('Failed to open chat');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFolderIcon = (folder) => {
    switch (folder) {
      case VAULT_FOLDERS.AI_ASSISTANCE:
        return '';
      case VAULT_FOLDERS.DOCUMENT_DRAFTING:
        return '';
      case VAULT_FOLDERS.DOCUMENT_INTERACTION:
        return '';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading vault...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <MainSidebar expanded={mainSidebarExpanded} setExpanded={setMainSidebarExpanded} />
      </div>
      
      {/* Hamburger for mobile - positioned like AI Assistance */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 dark:bg-neutral-950/80 border border-gray-200 dark:border-neutral-800 rounded-full p-2 shadow hover:bg-white dark:hover:bg-neutral-950 transition-colors"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar menu"
      >
        <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className={`flex flex-1 h-screen transition-all duration-300 ${mainSidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="flex flex-col w-full h-full overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden flex-shrink-0 p-4 pt-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="/Lamis Symbol 3.png"
                  alt="Lamis Symbol"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Lamis.AI Vault
                </span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Search Bar and Folder Tabs */}
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Folder Tabs */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(FOLDER_NAMES).map(([folderKey, folderName]) => (
                    <button
                      key={folderKey}
                      onClick={() => setSelectedFolder(folderKey)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                        selectedFolder === folderKey
                          ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-300 shadow-lg border border-purple-200 dark:border-purple-700/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-300 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-sm">{getFolderIcon(folderKey)}</span>
                      <span className="hidden sm:inline">{folderName}</span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                        {folderStats[folderKey] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <input
                      type="text"
                      placeholder={`Search in ${FOLDER_NAMES[selectedFolder]}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full sm:w-48 pl-10 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500 pointer-events-none z-10" />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Vaulted Chats List */}
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                        {FOLDER_NAMES[selectedFolder]} ({vaultedChats.length})
                      </h2>
                    </div>
                    
                    {vaultedChats.length === 0 ? (
                      <div className="flex items-center justify-center min-h-[40vh] p-6 sm:p-8 pt-12 sm:pt-16 text-center">
                        <div className="max-w-md">
                          <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Chats in {FOLDER_NAMES[selectedFolder]}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            No chats found in this folder. Save important conversations to see them here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {vaultedChats.map((chat) => (
                          <div key={chat._id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                    {chat.title}
                                  </h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {chat.messages?.length || 0} messages
                                  </span>
                                  {chat.folder && chat.folder !== selectedFolder && (
                                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full border border-purple-200 dark:border-purple-700">
                                      {FOLDER_NAMES[chat.folder]}
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                  {chat.description || 'No description'}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {formatDate(chat.createdAt)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {chat.messages?.length || 0} messages
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4">
                                <button
                                  onClick={() => handleViewChat(chat)}
                                  className="p-2 text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-300 transition-all duration-200 rounded-lg"
                                  title="View chat"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowMoveDialog(chat)}
                                  className="p-2 text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-300 transition-all duration-200 rounded-lg"
                                  title="Move to folder"
                                >
                                  <Move className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChat(chat._id)}
                                  className="p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Move Dialog */}
      {showMoveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Move to Folder
                </h3>
                <button
                  onClick={() => setShowMoveDialog(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Move "{showMoveDialog.title}" to a different folder:
              </p>

              <div className="space-y-2 mb-6">
                {Object.entries(FOLDER_NAMES).map(([folderKey, folderName]) => (
                  <button
                    key={folderKey}
                    onClick={() => handleMoveChat(showMoveDialog._id, folderKey)}
                    disabled={folderKey === selectedFolder}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      folderKey === selectedFolder
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/20 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <span className="text-lg">{getFolderIcon(folderKey)}</span>
                    <div className="text-left">
                      <div className="font-medium">{folderName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {FOLDER_DESCRIPTIONS[folderKey]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowMoveDialog(null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <VaultDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default VaultView; 