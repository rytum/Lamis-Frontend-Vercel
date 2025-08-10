import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, User, Calendar, Trash2, Eye, RotateCcw, Search, Filter, X, Bot, Copy, Check } from 'lucide-react';
import { documentDraftingService } from '../components/Sections/DocumentsDrafting/documentDraftingService';
import { useAuth0 } from '@auth0/auth0-react';

const DocumentHistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await documentDraftingService.getDraftingSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSelect = async (session) => {
    try {
      const sessionData = await documentDraftingService.getSession(session.sessionId);
      // Navigate to document drafting page with session data
      navigate('/documents-drafting', { 
        state: { 
          restoreSession: sessionData,
          sessionId: session.sessionId
        }
      });
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const handleViewSessionDetails = async (session) => {
    try {
      const sessionDetails = await documentDraftingService.getDocumentHistory(session.sessionId);
      console.log('Session Details:', sessionDetails); // Debug log
      console.log('AI Content Length:', sessionDetails?.aiContent?.length); // Debug log
      setSelectedSessionDetails(sessionDetails);
      setSelectedSession(session);
    } catch (error) {
      console.error('Error loading session details:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      // Add delete functionality to service
      await documentDraftingService.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.sessionId !== sessionId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || session.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    const colors = {
      'rental agreement': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'employment contract': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'service agreement': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'nda': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'partnership agreement': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Please log in to view your document history
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/documents-drafting')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Drafting</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Document Drafting History
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, client, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="rental agreement">Rental Agreement</option>
              <option value="employment contract">Employment Contract</option>
              <option value="service agreement">Service Agreement</option>
              <option value="nda">NDA</option>
              <option value="partnership agreement">Partnership Agreement</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No document history found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start creating documents to see them here.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {session.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                        {session.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Client: {session.client}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Author: {session.author}
                        </span>
                      </div>
                    </div>

                    {session.previewMessage && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        "{session.previewMessage}"
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(session.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated: {formatDate(session.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleSessionSelect(session)}
                      className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      title="Restore this session"
                    >
                      <RotateCcw size={16} />
                      <span className="text-sm">Restore</span>
                    </button>
                    
                    <button
                      onClick={() => handleViewSessionDetails(session)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="View session details"
                    >
                      <Eye size={16} />
                      <span className="text-sm">View</span>
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(session.sessionId)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="Delete this session"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Session Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setSelectedSessionDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Document Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Title:</span>
                      <p className="text-gray-900 dark:text-white">{selectedSessionDetails?.title || selectedSession.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <p className="text-gray-900 dark:text-white">{selectedSessionDetails?.type || selectedSession.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Client:</span>
                      <p className="text-gray-900 dark:text-white">{selectedSessionDetails?.client || selectedSession.client}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Author:</span>
                      <p className="text-gray-900 dark:text-white">{selectedSessionDetails?.author || selectedSession.author}</p>
                    </div>
                  </div>
                </div>
                
                {selectedSessionDetails?.conditions && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Conditions</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">{selectedSessionDetails.conditions}</p>
                    </div>
                  </div>
                )}
                
                                 {selectedSessionDetails?.aiContent && (
                   <div>
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                         <Bot size={16} className="text-green-600" />
                         AI Generated Content
                         <span className="text-xs text-gray-500 ml-2">
                           ({selectedSessionDetails.aiContent.length} characters)
                         </span>
                       </h3>
                       <button
                         onClick={() => copyToClipboard(selectedSessionDetails.aiContent)}
                         className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                         title="Copy AI content"
                       >
                         {copied ? <Check size={14} /> : <Copy size={14} />}
                         {copied ? 'Copied!' : 'Copy'}
                       </button>
                     </div>
                     <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 max-h-[70vh] overflow-y-auto">
                       <div className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap leading-relaxed font-mono">
                         {selectedSessionDetails.aiContent}
                       </div>
                     </div>
                   </div>
                 )}
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Timestamps</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500 dark:text-gray-400">Created:</span> {formatDate(selectedSessionDetails?.createdAt || selectedSession.createdAt)}</p>
                    <p><span className="text-gray-500 dark:text-gray-400">Updated:</span> {formatDate(selectedSessionDetails?.updatedAt || selectedSession.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setSelectedSessionDetails(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSessionSelect(selectedSession);
                    setSelectedSession(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Restore Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Session
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this session? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSession(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentHistoryPage; 