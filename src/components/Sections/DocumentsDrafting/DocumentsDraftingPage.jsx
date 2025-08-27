import React, { useState, useEffect, useRef } from 'react';
import Stepper from './Stepper';
import DocumentForm from './DocumentForm';
import DocumentPreview from './DocumentPreview';
import MainSidebar from '../AIAssistance/MainSidebar';
import StreamingText from '../AIAssistance/StreamingText';
import { ArrowRight, Send, AlertCircle, CheckCircle, Loader2, FileText, Save, FolderOpen, X, LogOut, Star, BookOpen, Plus, Library, History, Clock } from 'lucide-react';
import SaveToVault from '../Vault/SaveToVault';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { documentDraftingService } from './documentDraftingService';

import DocumentHistoryView from './DocumentHistoryView';

// Loading animation component with three dots like AI Assistant
const ThinkingAnimation = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Thinking...</span>
            </div>
        </div>
    );
};

// Mobile Drawer Component for Documents Drafting
const DocumentsDraftingDrawer = ({ open, onClose, onNewDocument }) => {
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
          {/* New Document Button */}
          <button
            onClick={() => {
              onNewDocument();
              onClose();
            }}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mb-4"
          >
            <span>New Document</span>
            <Plus size={20} />
          </button>

          {/* History Button */}
          <button
            onClick={() => {
              navigate('/document-history');
              onClose();
            }}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 mb-4"
          >
            <span>Document History</span>
            <History size={20} />
          </button>

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

// Chat input component with improved UX
const ChatInput = ({ onSend, disabled, placeholder = "Describe what you want to include in your document..." }) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (value.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSend(value.trim());
        setValue("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && !isSubmitting) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                 focus:border-purple-500/50 transition-all duration-200 resize-none min-h-[50px] sm:min-h-[60px] max-h-[100px] sm:max-h-[120px] text-sm sm:text-base"
        disabled={disabled || isSubmitting}
        rows={2}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim() || isSubmitting}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-purple-600 text-white 
                 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        aria-label="Send message"
      >
        {isSubmitting ? <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" /> : <Send size={16} className="sm:w-[18px] sm:h-[18px]" />}
      </button>
    </div>
  );
};

// Error/Success notification component
const Notification = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20';
  const textColor = type === 'error' ? 'text-red-400' : 'text-green-400';
  const iconColor = type === 'error' ? 'text-red-400' : 'text-green-400';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const initialForm = {
  title: '',
  client: '',
  author: '',
  type: '',
  effectiveDate: '',
  closeDate: ''
};

const DocumentsDraftingPage = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // Add mobile drawer state
  const [form, setForm] = useState(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiContent, setAiContent] = useState({});
  const [conditions, setConditions] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [showSaveToVault, setShowSaveToVault] = useState(false);
  const [sessionId, setSessionId] = useState(`doc-draft-${Date.now()}`); // Persistent session ID

  const [draftingSessions, setDraftingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle session restoration from history page
  useEffect(() => {
    const location = window.location;
    const urlParams = new URLSearchParams(location.search);
    const state = location.state;
    
    if (state && state.restoreSession) {
      const { restoreSession, sessionId: restoredSessionId } = state;
      
      // Restore form data
      if (restoreSession.form) {
        setForm(restoreSession.form);
      }
      
      // Restore conditions
      if (restoreSession.conditions) {
        setConditions(restoreSession.conditions);
      }
      
      // Restore AI content
      if (restoreSession.aiContent) {
        setAiContent(restoreSession.aiContent);
      }
      
      // Restore messages
      if (restoreSession.messages && restoreSession.messages.length > 0) {
        setMessages(restoreSession.messages);
      }
      
      // Set session ID
      if (restoredSessionId) {
        setSessionId(restoredSessionId);
      }
      
      // Set to step 3 (AI chat) if there are messages
      if (restoreSession.messages && restoreSession.messages.length > 0) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
      
      // Clear the state to prevent re-restoration
      window.history.replaceState({}, document.title);
    }
  }, []);
  
  // Fetch drafting sessions on component mount
  useEffect(() => {
    fetchDraftingSessions();
  }, []);
  
  // Function to fetch all drafting sessions
  const fetchDraftingSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await documentDraftingService.getDraftingSessions();
      setDraftingSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch drafting sessions:', err);
      setNotification({
        type: 'error',
        message: `Failed to fetch history: ${err.message}`
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  // Handle chat message with improved error handling
  const handleChatMessage = async (message) => {
    if (loadingAI) return;

    try {
      setLoadingAI(true);
      
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random()
      };
      
      setMessages(prev => [...prev, userMessage]);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      const response = await fetch('/api/documents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message,
          context: {
            sessionId: sessionId,
            title: form.title,
            client: form.client,
            author: form.author,
            type: form.type,
            conditions: conditions || '',
            previousContent: aiContent[3] || '',
            chatHistory: [...chatHistory, { role: 'user', content: message, timestamp: new Date().toISOString() }]
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const aiMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // If the AI response includes document modifications, update the preview
      if (data.aiContent) {
        const cleanContent = cleanAiContent(data.aiContent);
        setAiContent(prev => ({ ...prev, 3: cleanContent, 4: cleanContent }));
      }

      // Automatically save to database when AI responds
      try {
        const saveResponse = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: form.title,
            client: form.client,
            author: form.author,
            type: form.type,
            conditions: conditions,
            aiContent: data.aiContent || data.content,
            sessionId: sessionId,
            chatHistory: [...messages, userMessage, aiMessage].map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp
            }))
          })
        });

        if (saveResponse.ok) {
          console.log('Document automatically updated in database');
          // Refresh the drafting sessions list
          await fetchDraftingSessions();
        } else {
          console.warn('Failed to auto-update document:', await saveResponse.text());
        }
      } catch (saveError) {
        console.error('Auto-save error:', saveError);
        // Don't show error to user as this is background operation
      }
      
    } catch (err) {
      console.error('Chat error:', err);
      setNotification({
        type: 'error',
        message: `Failed to get AI response: ${err.message}`
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const generateFinalDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, conditions })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate agreement');
      }

      const data = await response.json();
      setAiContent(prev => ({ ...prev, 3: data.aiContent, 4: data.aiContent }));
      setDocumentGenerated(true);
    } catch (err) {
      console.error('Document generation error:', err);
      setNotification({
        type: 'error',
        message: `Document generation failed: ${err.message}`
      });
    }
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle session selection from history
  const handleSessionSelect = async (session) => {
    try {
      setLoadingAI(true);
      const data = await documentDraftingService.getSession(session.sessionId);
      
      if (!data || !data.sessionData) {
        throw new Error('Invalid session data received');
      }
      
      // Update form data
      if (data.sessionData.form) {
        setForm({
          title: data.sessionData.form.title || '',
          client: data.sessionData.form.client || '',
          author: data.sessionData.form.author || '',
          type: data.sessionData.form.type || '',
          effectiveDate: data.sessionData.form.effectiveDate || '',
          closeDate: data.sessionData.form.closeDate || ''
        });
      }
      
      // Update conditions
      if (data.sessionData.conditions) {
        setConditions(data.sessionData.conditions);
      }
      
      // Update messages
      if (data.sessionData.messages && Array.isArray(data.sessionData.messages)) {
        setMessages(data.sessionData.messages.map(msg => ({
          ...msg,
          id: Date.now() + Math.random()
        })));
      }
      
      // Update AI content
      if (data.sessionData.aiContent) {
        setAiContent(data.sessionData.aiContent);
      } else if (data.document?.aiContent) {
        setAiContent({ 3: data.document.aiContent, 4: data.document.aiContent });
      }
      
      // Show notification
      setNotification({
        type: 'success',
        message: 'Draft loaded successfully'
      });
      
    } catch (err) {
      console.error('Failed to load drafting session:', err);
      setNotification({
        type: 'error',
        message: `Failed to load draft: ${err.message}`
      });
    } finally {
      setLoadingAI(false);
    }
  };
  
  // Handle session deletion
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        // We can reuse the API from document-interaction for deletion
        await fetch(`/api/document-interaction/session/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Remove from local state
        setDraftingSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        
        setNotification({
          type: 'success',
          message: 'Draft deleted successfully'
        });
      } catch (err) {
        console.error('Failed to delete drafting session:', err);
        setNotification({
          type: 'error',
          message: `Failed to delete draft: ${err.message}`
        });
      }
    }
  };



  const handleConditionsChange = (e) => {
    setConditions(e.target.value);
  };

  // Validate form fields
  const validateStep = (step) => {
    switch (step) {
      case 2:
        if (!form.title || !form.client || !form.author || !form.type) {
          setNotification({
            type: 'error',
            message: 'Please fill all required fields before proceeding.'
          });
          return false;
        }
        break;
      case 3:
        if (!conditions.trim()) {
          setNotification({
            type: 'error',
            message: 'Please enter conditions before proceeding.'
          });
          return false;
        }
        break;
      case 4:
        // Require AI content since it's automatically generated in step 3
        if (!aiContent[3]) {
          setNotification({
            type: 'error',
            message: 'Please wait for AI to generate the document before proceeding.'
          });
          return false;
        }
        break;
    }
    return true;
  };

  const cleanAiContent = (content) => {
    // Remove thinking process text and keep only the clean agreement
    if (!content) return '';
    
    // Remove common thinking process indicators
    const thinkingIndicators = [
      "Alright, so I'm trying to help the user",
      "I'm analyzing your document requirements",
      "Let me start by understanding",
      "I'll start by drafting",
      "I should probably",
      "I need to structure",
      "I'll include sections like",
      "I should also consider",
      "I'll write each section",
      "I'll make sure each clause",
      "Finally, I'll include",
      "So, putting it all together",
      "I'll structure the agreement"
    ];
    
    let cleanedContent = content;
    
    // Remove thinking process text
    thinkingIndicators.forEach(indicator => {
      const regex = new RegExp(`.*${indicator}.*?(?=\\n\\n|$)`, 'gi');
      cleanedContent = cleanedContent.replace(regex, '');
    });
    
    // Remove thinking process indicators and markdown artifacts
    cleanedContent = cleanedContent
      .replace(/<think>.*?<\/think>/g, '') // Remove <think> tags
      .replace(/## <think>.*?<\/think>/g, '') // Remove ## <think> patterns
      .replace(/##\s*<think>.*?<\/think>/g, '') // Remove ## <think> with spaces
      .replace(/<think>.*?<\/think>/g, '') // Remove any remaining think tags
      .replace(/##\s*$/gm, '') // Remove standalone ##
      .replace(/^##\s*$/gm, '') // Remove ## at start of lines
      .replace(/^\s*##\s*$/gm, ''); // Remove ## with whitespace
    
    // Remove any remaining thinking process text patterns but preserve document structure
    cleanedContent = cleanedContent.replace(/.*?(?=RENTAL AGREEMENT|AGREEMENT|CONTRACT|LEASE|PARTIES|TERMS|SECTION|ARTICLE|CLAUSE|1\.|2\.|3\.|4\.|5\.|6\.|7\.|8\.|9\.|10\.)/is, '');
    
    // Clean up extra whitespace but preserve line breaks
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive line breaks
    cleanedContent = cleanedContent.trim();
    
    // Ensure proper line breaks are preserved
    cleanedContent = cleanedContent.replace(/\\n/g, '\n'); // Fix escaped newlines
    
    // Ensure proper spacing around headings and sections
    cleanedContent = cleanedContent.replace(/([A-Z][A-Z\s]+:)/g, '\n\n$1\n'); // Add spacing around headings
    cleanedContent = cleanedContent.replace(/(\d+\.\s+[A-Z][^:]*:)/g, '\n\n$1\n'); // Add spacing around numbered sections
    
    return cleanedContent || content; // Return original if cleaning removes everything
  };

  const handleStepChange = async (step) => {
    if (!validateStep(step)) return;
    
    setCurrentStep(step);
    
    if (step === 3) {
      // Reset document generated state when entering brainstorming step
      setDocumentGenerated(false);
      setLoadingAI(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }

        // First, add an initial AI message to show the thinking process
        const initialAiMessage = {
          role: 'assistant',
          content: "I've generated your initial agreement based on the provided information. You can now ask me to modify any part of the document. For example:\n\n• 'Add a termination clause'\n• 'Change the rental amount to $2000'\n• 'Add a security deposit section'\n• 'Make the agreement more formal'\n• 'Add maintenance responsibilities'\n\nJust tell me what changes you'd like!",
          timestamp: new Date().toISOString(),
          id: Date.now() + Math.random()
        };
        
        // Only add initial message if no messages exist yet
        if (messages.length === 0) {
          setMessages([initialAiMessage]);
        }

        const response = await fetch('/api/documents/generate', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            ...form, 
            conditions,
            sessionId: sessionId
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to generate agreement');
        }

        const data = await response.json();
        
        // Clean the AI content to remove thinking process and keep only the agreement
        const cleanContent = cleanAiContent(data.aiContent);
        setAiContent(prev => ({ ...prev, 3: cleanContent, 4: cleanContent }));
        
        // Add a completion message to the chat
        const completionMessage = {
          role: 'assistant',
          content: "Perfect! Your agreement is ready. You can now ask me to modify any part of the document. What would you like to change?",
          timestamp: new Date().toISOString(),
          id: Date.now() + Math.random()
        };
        setMessages(prev => [...prev, completionMessage]);
        setDocumentGenerated(true);

        // Automatically save to database when AI completes generation
        try {
          const saveResponse = await fetch('/api/documents', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: form.title,
              client: form.client,
              author: form.author,
              type: form.type,
              conditions: conditions,
              aiContent: cleanContent,
              sessionId: sessionId,
              chatHistory: [...messages, completionMessage].map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp
              }))
            })
          });

          if (saveResponse.ok) {
            console.log('Document automatically saved to database');
            // Refresh the drafting sessions list
            await fetchDraftingSessions();
          } else {
            console.warn('Failed to auto-save document:', await saveResponse.text());
          }
        } catch (saveError) {
          console.error('Auto-save error:', saveError);
          // Don't show error to user as this is background operation
        }
      } catch (err) {
        setNotification({
          type: 'error',
          message: `AI generation failed: ${err.message}`
        });
      } finally {
        setLoadingAI(false);
      }
    }
  };

  const handlePublish = async () => {
    if (!form.title || !form.client || !form.author || !form.type || !conditions || !aiContent[3]) {
      setNotification({
        type: 'error',
        message: 'Missing required fields or AI content.'
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          client: form.client,
          author: form.author,
          type: form.type,
          conditions: conditions,
          aiContent: aiContent[3],
          sessionId: sessionId,
          chatHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        switch (response.status) {
          case 401:
            throw new Error('Your session has expired. Please log in again.');
          case 400:
            throw new Error(`Please ensure all required fields are filled correctly: ${errorData.message || ''}`);
          case 500:
            throw new Error(`Server error: ${errorData.error || 'Unknown server error'}`);
          default:
            throw new Error(errorData.message || 'Failed to save document');
        }
      }

      const data = await response.json();
      
      setNotification({
        type: 'success',
        message: 'Document saved successfully!'
      });
      
      // Reset form after successful save
      setTimeout(() => {
        setCurrentStep(1);
        setForm(initialForm);
        setConditions('');
        setAiContent({});
        setMessages([]);
        setDocumentGenerated(false);
      }, 2000);
    } catch (err) {
      console.error('Save error:', err);
      
      if (!window.navigator.onLine) {
        setNotification({
          type: 'error',
          message: 'Network error: Please check your internet connection'
        });
        return;
      }
      
      setNotification({
        type: 'error',
        message: err.message || 'An unexpected error occurred while saving the document'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vault handlers
  const handleSaveToVault = () => {
    console.log('DocumentsDraftingPage - handleSaveToVault called');
    console.log('Current messages:', messages);
    console.log('Current form:', form);
    console.log('Current conditions:', conditions);
    console.log('Current aiContent:', aiContent);
    console.log('SessionId:', sessionId);
    
    // Check if there are any messages to save
    if (!messages || messages.length === 0) {
      setNotification({
        type: 'error',
        message: 'No conversation found. Please interact with the AI assistant first before saving to vault.'
      });
      return;
    }
    
    // Check if the document has been generated
    if (!aiContent[3] && !documentGenerated) {
      setNotification({
        type: 'error',
        message: 'Please generate a document first before saving to vault.'
      });
      return;
    }
    
    setShowSaveToVault(true);
  };

  const handleVaultSaveSuccess = () => {
    setShowSaveToVault(false);
    setNotification({
      type: 'success',
      message: 'Document drafting session saved to vault successfully!'
    });
  };

  const handleVaultCancel = () => {
    setShowSaveToVault(false);
  };

  const handleNewDocument = () => {
    setForm(initialForm);
    setCurrentStep(1);
    setConditions('');
    setAiContent({});
    setMessages([]);
    setDocumentGenerated(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <MainSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
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
      
      <div className={`flex flex-1 h-screen transition-all duration-300 ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>  
        {/* Mobile Layout: Stacked */}
        <div className="flex flex-col w-full lg:hidden h-full min-h-0">
          {/* Mobile Header with Stepper - Add top padding to avoid hamburger overlap */}
          <div className="flex-shrink-0 p-3 sm:p-4 pt-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
            <Stepper currentStep={currentStep} onStepChange={handleStepChange} />
          </div>
          
          {/* Mobile Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Form/Conditions Section */}
            <div className="p-3 sm:p-4 h-full flex flex-col">
              {currentStep === 1 && (
                <DocumentForm form={form} onFormChange={handleFormChange} />
              )}
              
              {currentStep === 2 && (
                <div className="w-full space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide mb-2 sm:mb-3">
                      Agreement Conditions
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-100 
                               placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                               focus:border-purple-500/50 transition-all duration-200 resize-none min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
                      value={conditions}
                      onChange={handleConditionsChange}
                      placeholder="Enter agreement conditions, terms, or clauses..."
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">AI Assistant</h3>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                    {messages.length === 0 && !loadingAI && (
                      <div className="flex justify-center items-center py-6 sm:py-8">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <Send size={18} className="sm:w-5 sm:h-5 text-purple-400" />
                          </div>
                          <p className="text-xs sm:text-sm">Your document is being generated...</p>
                          <p className="text-xs mt-1">Once ready, you can ask me to modify any part of the agreement</p>
                        </div>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-2.5 sm:p-3 ${
                          message.role === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-200'
                        }`}>
                          <div className="text-xs sm:text-sm">
                            {message.role === 'user' ? (
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            ) : (
                              <StreamingText 
                                text={message.content} 
                                speed={20}
                              />
                            )}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {loadingAI && <ThinkingAnimation />}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Chat Input Fixed at Bottom */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <ChatInput 
                      onSend={handleChatMessage} 
                      disabled={loadingAI}
                      placeholder="Ask me to modify the document..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Ask me to modify any part of your document. I'll update the preview automatically with your requested changes.
                    </p>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-6 sm:py-8">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Ready to Publish</h3>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Your document is ready to be saved and published.</p>
                  </div>
                  <button 
                    className="w-full px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 
                             transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 text-sm sm:text-base"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                        Publishing...
                      </div>
                    ) : (
                      'Publish & Save'
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile Preview Section */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="p-3 sm:p-4">
                <DocumentPreview 
                  form={form} 
                  aiContent={aiContent} 
                  currentStep={currentStep} 
                  conditions={conditions} 
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveToVault}
                  disabled={!messages || messages.length === 0}
                  className={`px-2.5 sm:px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 flex items-center gap-1 ${
                    !messages || messages.length === 0 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  title={!messages || messages.length === 0 ? "Interact with AI first" : "Save this session to vault"}
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                  Save
                </button>
                <button 
                  onClick={() => navigate('/vault')}
                  className="px-2.5 sm:px-3 py-2 rounded-lg bg-white dark:bg-black border border-purple-600 text-purple-600 dark:text-purple-400 
                           hover:bg-purple-50 dark:hover:bg-purple-950 font-semibold text-xs sm:text-sm transition-colors
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 flex items-center gap-1"
                  title="View vaulted sessions"
                >
                  <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                  Vault
                </button>
              </div>
              
              {currentStep < 4 && (
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-700 text-white hover:bg-purple-800 
                           transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           disabled:opacity-50 flex items-center justify-center"
                  disabled={loadingAI}
                  aria-label="Continue to next step"
                >
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout: Side by Side */}
        <div className="hidden lg:flex w-full">
          {/* Left Section: Stepper + Form/Conditions */}
          <div className="flex flex-col w-2/5 h-full px-4 py-4 overflow-hidden">
            <div className="mb-4">
              <Stepper currentStep={currentStep} onStepChange={handleStepChange} />
            </div>
            
            <div className="flex-1 flex items-start overflow-hidden">
              {currentStep === 1 && (
                <DocumentForm form={form} onFormChange={handleFormChange} />
              )}
              
              {currentStep === 2 && (
                <div className="w-full space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide mb-3">
                      Agreement Conditions
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-gray-100 
                               placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                               focus:border-purple-500/50 transition-all duration-200 resize-none min-h-[200px]"
                      value={conditions}
                      onChange={handleConditionsChange}
                      placeholder="Enter agreement conditions, terms, or clauses..."
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="w-full h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">AI Assistant</h3>
                    </div>
                    

                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.length === 0 && !loadingAI && (
                      <div className="flex justify-center items-center py-8">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Send size={20} className="text-purple-400" />
                          </div>
                          <p className="text-sm">Your document is being generated...</p>
                          <p className="text-xs mt-1">Once ready, you can ask me to modify any part of the agreement</p>
                        </div>
                      </div>
                    )}
                    
                    {messages.map((message, index) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-200'
                        }`}>
                                                     <div className="text-sm">
                             {message.role === 'user' ? (
                               <div className="whitespace-pre-wrap">{message.content}</div>
                             ) : (
                               <StreamingText 
                                 text={message.content} 
                                 speed={20}
                               />
                             )}
                           </div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {loadingAI && <ThinkingAnimation />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input Fixed at Bottom */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <ChatInput 
                      onSend={handleChatMessage} 
                      disabled={loadingAI}
                      placeholder="Ask me to modify the document... (e.g., 'Add a termination clause', 'Change the rental amount')"
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="w-full flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Ready to Publish</h3>
                    <p className="text-gray-500 dark:text-gray-400">Your document is ready to be saved and published.</p>
                  </div>
                  <button 
                    className="px-8 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 
                             transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Publishing...
                      </div>
                    ) : (
                      'Publish & Save'
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Next Button - Only show for steps 1-2, hidden for step 3 to avoid overlap */}
            {currentStep < 3 && (
              <div className="mt-auto pb-6 flex justify-end">
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="w-12 h-12 rounded-full bg-purple-700 text-white hover:bg-purple-800 
                           transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           disabled:opacity-50 flex items-center justify-center"
                  disabled={loadingAI}
                  aria-label="Continue to next step"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
            
            {/* Next Button for Step 3 - Positioned differently */}
            {currentStep === 3 && (
              <div className="mt-4 pb-6 flex justify-end">
                <button
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="w-12 h-12 rounded-full bg-purple-700 text-white hover:bg-purple-800 
                           transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                           disabled:opacity-50 flex items-center justify-center"
                  disabled={loadingAI}
                  aria-label="Continue to next step"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 dark:bg-gray-700 h-full" />
          
          {/* Right Section: Preview + Buttons */}
          <div className="flex flex-col w-3/5 h-full px-4 py-4 overflow-hidden">
            {/* Button Row */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-2 ml-auto">
                <button 
                  onClick={handleSaveToVault}
                  disabled={!messages || messages.length === 0}
                  className={`px-2 py-1 rounded-full border border-purple-600 font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs flex items-center gap-1 ${
                    !messages || messages.length === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                      : 'bg-white dark:bg-black text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-white'
                  }`}
                  title={!messages || messages.length === 0 ? "Interact with AI first" : "Save this session to vault"}
                >
                  <Save className="h-3 w-3" />
                  Save to Vault
                </button>
                <button 
                  onClick={() => navigate('/vault')}
                  className="px-2 py-1 rounded-full bg-white dark:bg-black border border-purple-600 text-purple-600 dark:text-purple-400 
                           hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-white font-semibold tracking-wide transition-colors
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs flex items-center gap-1"
                  title="View vaulted sessions"
                >
                  <FolderOpen className="h-3 w-3" />
                  View Vault
                </button>
                <button 
                  onClick={() => navigate('/document-history')}
                  className="px-2 py-1 rounded-full bg-white dark:bg-black border border-purple-600 text-purple-600 dark:text-purple-400 
                           hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-white font-semibold tracking-wide transition-colors
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs flex items-center gap-1"
                  title="View document history"
                >
                  <History className="h-3 w-3" />
                  History
                </button>
                <button className="px-2 py-1 rounded-full bg-white dark:bg-black border border-purple-600 text-purple-600 dark:text-purple-400 
                           hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-white font-semibold tracking-wide transition-colors
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs flex items-center gap-1">
                  + New Doc
                </button>
              </div>
            </div>
             
            <div className="flex-1 min-h-0 overflow-auto">
              <DocumentPreview 
                form={form} 
                aiContent={aiContent} 
                currentStep={currentStep} 
                conditions={conditions}
                onSaveToVault={handleSaveToVault}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Save to Vault Modal */}
      <SaveToVault
        sessionId={sessionId}
        feature="document-drafting"
        sessionData={{
          messages,
          form,
          conditions,
          aiContent
        }}
        onSave={handleVaultSaveSuccess}
        onCancel={handleVaultCancel}
        isVisible={showSaveToVault}
      />

      {/* Mobile Drawer */}
      <DocumentsDraftingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNewDocument={handleNewDocument}
      />
      


        {/* Document History View Modal */}
        {selectedHistorySession && (
          <DocumentHistoryView
            sessionId={selectedHistorySession}
            onClose={() => setSelectedHistorySession(null)}
            onBack={() => setSelectedHistorySession(null)}
          />
        )}
      </div>
    );
  };

export default DocumentsDraftingPage;