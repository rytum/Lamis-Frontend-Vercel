import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../AIAssistance/Sidebar';
import AIAssistanceInput from './AIAssistanceInput';
import { useAuth0 } from '@auth0/auth0-react';
import { aiAssistanceService } from './aiAssistanceService';
import { backendAIService } from './backendAIService';
import MainSidebar from './MainSidebar';
import SidebarDrawer from './SidebarDrawer'; // Added for mobile view
import { aiAssistanceHistoryService } from './aiAssistanceHistoryService';
import { useNavigate } from 'react-router-dom';
import SaveResponseToVault from '../Vault/SaveResponseToVault';
import { Save, BarChart3, Download } from 'lucide-react';
import { AnalyticsDashboard, CaseAnalyticsSummary } from './ChartComponents';
import { enhanceLinksInHtml } from '../../../utils/linkUtils';

// Loading animation component to replace the single line
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

// Utility function to convert markdown to HTML with Perplexity-style formatting
const convertMarkdownToHtml = (text) => {
  if (!text) return '';
  
  // Check if the text contains JSON chart data
  const hasChartData = text.includes('case_analytics') || text.includes('graphs') || text.includes('chart_type');
  
  if (hasChartData) {
    // Try to extract JSON data from the response
    try {
      // Look for JSON blocks in the text
      const jsonMatches = text.match(/```json\s*([\s\S]*?)\s*```/g);
      if (jsonMatches) {
        // Extract the JSON data
        const jsonData = jsonMatches.map(match => {
          const jsonContent = match.replace(/```json\s*/, '').replace(/\s*```/, '');
          return JSON.parse(jsonContent);
        });
        
        // Convert the non-JSON parts to HTML
        let result = text;
        jsonMatches.forEach(match => {
          result = result.replace(match, `<div class="json-chart-data" style="display: none;">${match}</div>`);
        });
        
        // Convert remaining markdown to HTML
        result = convertMarkdownToHtmlBasic(result);
        
        return result;
      }
    } catch (error) {
      console.log('Failed to parse JSON chart data:', error);
    }
  }
  
  // If no chart data or parsing failed, use basic conversion
  return convertMarkdownToHtmlBasic(text);
};

// Basic markdown to HTML conversion (original function)
const convertMarkdownToHtmlBasic = (text) => {
  if (!text) return '';
  
  let result = text;
  
  // Convert Perplexity-style citations ^[1]^ to clickable superscript links
  result = result.replace(/\^\[(\d+)\]\^/g, '<sup class="citation"><a href="#source-$1" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors cursor-pointer no-underline">[$1]</a></sup>');
  
  // Convert plain URLs to clickable links (http/https/ftp)
  result = result.replace(/(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g, (match, url) => {
    return `<a href="${url}" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
  
  // Convert markdown links [text](url) with robust handling for complex URLs
  // Use a more comprehensive regex that handles URLs with special characters
  result = result.replace(/\[([^\]]+)\]\(([^)\s]+(?:\s+[^)]*)?[^)\s])\)/g, (match, linkText, url) => {
    // Clean and validate URL
    const cleanUrl = url.trim();
    return `<a href="${cleanUrl}" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });
  
  // Fallback: Handle any remaining markdown links with a simpler pattern
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const cleanUrl = url.trim();
    return `<a href="${cleanUrl}" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });
  
  // Convert bullet points • to styled list items
  result = result.replace(/^• (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span><span>$1</span></div>');
  
  // Convert numbered lists
  result = result.replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-purple-600 dark:text-purple-400 font-bold min-w-[1.5rem]">$1.</span><span>$2</span></div>');
  
  // Convert code blocks (`code`)
  result = result.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono border">$1</code>');
  
  // Convert bold text (**text** or __text__)
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
  result = result.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
  
  // Convert italic text (*text* or _text_)
  result = result.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
  result = result.replace(/_(.*?)_/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
  
  // Convert headers with improved styling
  result = result.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">$1</h3>');
  result = result.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b-2 border-purple-200 dark:border-purple-800 pb-2">$1</h2>');
  result = result.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');
  
  // Convert horizontal rules
  result = result.replace(/^---$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />');
  
  // Convert line breaks
  result = result.replace(/\n/g, '<br />');
  
  return result;
};

// Suggested action buttons for legal assistance with navigation
const suggestedActions = [
  {
    title: 'Docs Interaction',
    type: 'navigation',
    path: '/docs-interaction/upload'
  },
  {
    title: 'Document Drafting',
    type: 'navigation',
    path: '/documents-drafting'
  }
];

const AIAssistanceView = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // State for mobile sidebar
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mainSidebarExpanded, setMainSidebarExpanded] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const [showSaveResponseToVault, setShowSaveResponseToVault] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedUserMessage, setSelectedUserMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    // Load activeTab from localStorage on initialization
    const savedActiveTab = localStorage.getItem('lamis_ai_active_tab');
    return savedActiveTab || 'chat';
  }); // 'chat' or 'analytics'
  const [currentAIResponse, setCurrentAIResponse] = useState(null);
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [aiStartedResponding, setAiStartedResponding] = useState(false);
  const [displayedSources, setDisplayedSources] = useState([]);
  const { user } = useAuth0();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // Helper to map backend messages to frontend format
  const mapMessages = (messages) =>
    messages.map((msg) => ({
      role: msg.meta?.role || msg.sender,
      content: msg.message,
      // Preserve additional properties for AI responses
      ...(msg.caseSummaries && { caseSummaries: msg.caseSummaries }),
      ...(msg.caseDownloads && { caseDownloads: msg.caseDownloads }),
      ...(msg.analytics && { analytics: msg.analytics }),
      ...(msg.sources && { sources: msg.sources }),
      ...(msg.id && { id: msg.id }),
      ...(msg.isStreaming !== undefined && { isStreaming: msg.isStreaming })
    }));

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Immediate scroll to bottom (for better responsiveness during streaming)
  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  // Scroll to bottom when messages change or when streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Additional scroll during streaming updates
  useEffect(() => {
    if (streamingMessageId) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100); // Scroll every 100ms during streaming
      
      return () => clearInterval(interval);
    }
  }, [streamingMessageId]);

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lamis_ai_active_tab', activeTab);
  }, [activeTab]);

  // Frontend-only session management with localStorage persistence
  useEffect(() => {
    const initializeChat = () => {
      try {
        // Load sessions from localStorage
        const savedSessions = localStorage.getItem('lamis_ai_sessions');
        const parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
        
        setSessions(parsedSessions);
        
        if (parsedSessions.length > 0) {
          // Load the most recent session
          const mostRecentSession = parsedSessions[0];
          setCurrentSession(mostRecentSession);
          
          // Load messages for this session from localStorage
          const savedMessages = localStorage.getItem(`lamis_ai_messages_${mostRecentSession.sessionId}`);
          const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];
          
                     if (parsedMessages.length > 0) {
             setMessages(parsedMessages);
             
             // Check if the last message has analytics data
             const lastMessage = parsedMessages[parsedMessages.length - 1];
             if (lastMessage && lastMessage.analytics && lastMessage.analytics.case_analytics) {
               setCurrentAIResponse({
                 case_analytics: lastMessage.analytics.case_analytics,
                 case_downloads: lastMessage.caseDownloads,
                 case_summaries: lastMessage.caseSummaries,
                 processing_time: lastMessage.processing_time,
                 query: lastMessage.query
               });
             }
           } else {
            // If no messages, show welcome message
            const welcomeMessage = [{ 
              role: 'assistant', 
              content: 'Hi! How can I help you today?',
              id: Date.now(),
              isStreaming: false
            }];
            setMessages(welcomeMessage);
            localStorage.setItem(`lamis_ai_messages_${mostRecentSession.sessionId}`, JSON.stringify(welcomeMessage));
          }
        } else {
          // Create a new session if none exist
          handleNewChat();
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        // Fallback: create new session
        handleNewChat();
      }
    };
    initializeChat();
  }, []);

  // Handler for creating a new chat session
  const handleNewChat = async () => {
    const newSession = await backendAIService.startSession();
    
    // Add to sessions list at the beginning
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSession(newSession);
    
         // Reset current AI response for new chat
     setCurrentAIResponse(null);
     
     // Reset to chat tab for new chat
     setActiveTab('chat');
     
     // Set welcome message
    const welcomeMessage = [{ 
      role: 'assistant', 
      content: 'Hi! How can I help you today?',
      id: Date.now(),
      isStreaming: false
    }];
    setMessages(welcomeMessage);
    
    // Save to localStorage
    localStorage.setItem('lamis_ai_sessions', JSON.stringify(updatedSessions));
    localStorage.setItem(`lamis_ai_messages_${newSession.sessionId}`, JSON.stringify(welcomeMessage));
  };

  // Handler for selecting a session from the sidebar
  const handleSessionSelect = (session) => {
    setCurrentSession(session);
    
    // Reset current AI response when switching sessions
    setCurrentAIResponse(null);
    setAiStartedResponding(false);
    
    // Load messages for this session from localStorage
    const savedMessages = localStorage.getItem(`lamis_ai_messages_${session.sessionId}`);
    const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];
    
    if (parsedMessages.length > 0) {
      setMessages(parsedMessages);
      
      // Check if the last message has analytics data
      const lastMessage = parsedMessages[parsedMessages.length - 1];
      if (lastMessage && lastMessage.analytics && lastMessage.analytics.case_analytics) {
        setCurrentAIResponse({
          case_analytics: lastMessage.analytics.case_analytics,
          case_downloads: lastMessage.caseDownloads,
          case_summaries: lastMessage.caseSummaries,
          processing_time: lastMessage.processing_time,
          query: lastMessage.query
        });
      } else {
        // If no analytics data, reset to chat tab
        setActiveTab('chat');
      }
    } else {
      // If no messages, show welcome message and reset to chat tab
      setActiveTab('chat');
      // If no messages, show welcome message
      const welcomeMessage = [{ 
        role: 'assistant', 
        content: 'Hi! How can I help you today?',
        id: Date.now(),
        isStreaming: false
      }];
      setMessages(welcomeMessage);
      localStorage.setItem(`lamis_ai_messages_${session.sessionId}`, JSON.stringify(welcomeMessage));
    }
  };

  // Handler for clearing chat history (frontend-only)
  const handleClearHistory = () => {
    // Clear all sessions and messages from localStorage
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
    
    // Reset frontend state to empty - no sessions, no messages, no current session
    setSessions([]);
    setMessages([]);
    setCurrentSession(null);
    setCurrentAIResponse(null);
    setAiStartedResponding(false);
  };



  // Handler for deleting a session (frontend-only)
  const handleDeleteSession = (sessionToDelete) => {
    // Remove messages for this session from localStorage
    localStorage.removeItem(`lamis_ai_messages_${sessionToDelete.sessionId}`);
    
    // Filter out the deleted session
    const updatedSessions = sessions.filter(s => s.sessionId !== sessionToDelete.sessionId);
    setSessions(updatedSessions);
    
    // Update localStorage
    localStorage.setItem('lamis_ai_sessions', JSON.stringify(updatedSessions));
    
    // If the deleted session was the current session, handle switching
    if (currentSession && currentSession.sessionId === sessionToDelete.sessionId) {
      if (updatedSessions.length > 0) {
        // Switch to the first available session
        handleSessionSelect(updatedSessions[0]);
      } else {
        // No sessions left, create a new one
        handleNewChat();
      }
    } else {
      // Reset current AI response if we're not switching to a new session
      setCurrentAIResponse(null);
    }
  };

  // Logic to handle sending a message with streaming effect
  const handleSend = async (message) => {
    if (!currentSession || !message.trim()) return;

    setLoading(true);
    setAiStartedResponding(false);
    try {
      // Add user message
      const userMessage = { 
        role: 'user', 
        content: message,
        id: Date.now() + Math.random(),
        isStreaming: false
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Add placeholder for AI response
      const aiMessageId = Date.now();
      const assistantMessage = { 
        role: 'assistant', 
        content: '', 
        id: aiMessageId,
        isStreaming: true 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessageId(aiMessageId);
      
      // Get AI response using backend service for database storage
      const response = await backendAIService.sendMessage(
        currentSession.sessionId,
        message
      );
      
      if (response.aiResponse) {
        // Debug logging for case summaries
        if (import.meta.env.DEV) {
          // console.debug('AI response received');
        }
        
        // Simulate streaming by breaking response into chunks
        const words = response.aiResponse.answer.split(' ');
        let currentContent = '';
        
        // Initialize sources display
        setDisplayedSources([]);
        
        for (let i = 0; i < words.length; i++) {
          currentContent += (i > 0 ? ' ' : '') + words[i];
          
          // Set aiStartedResponding to true when AI starts giving content
          if (i === 0) {
            setAiStartedResponding(true);
          }
          
          // Stream sources one by one after the main content is complete
          const sources = response.aiResponse.sources || [];
          const sourcesToShow = Math.floor((i + 1) / Math.max(1, Math.floor(words.length / sources.length)));
          
          const newMessages = updatedMessages.concat([{
            ...assistantMessage,
            content: currentContent,
            isStreaming: i < words.length - 1,
            sources: sources,
            caseDownloads: response.aiResponse.case_downloads || [],
            caseSummaries: response.aiResponse.case_summaries || [],
            analytics: response.aiResponse.case_analytics || null
          }]);
          
          setMessages(newMessages);
          
          // Save to localStorage during streaming
          if (currentSession) {
            localStorage.setItem(`lamis_ai_messages_${currentSession.sessionId}`, JSON.stringify(newMessages));
          }
          
          // Add delay for streaming effect
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Show sources one by one after main content is complete
        const sources = response.aiResponse.sources || [];
        setDisplayedSources([]); // Start with empty sources
        for (let i = 0; i < sources.length; i++) {
          setDisplayedSources(sources.slice(0, i + 1));
          await new Promise(resolve => setTimeout(resolve, 300)); // Slower for sources
        }
        
        // Final save with complete message
        const finalMessages = updatedMessages.concat([{
          ...assistantMessage,
          content: response.aiResponse.answer,
          isStreaming: false,
          sources: response.aiResponse.sources || [],
          caseDownloads: response.aiResponse.case_downloads || [],
          caseSummaries: response.aiResponse.case_summaries || [],
          analytics: response.aiResponse.case_analytics || null
        }]);
        
        setMessages(finalMessages);
        setStreamingMessageId(null);
        setLoading(false);
        
        // Set current AI response for analytics tab
        if (response.aiResponse.case_analytics || response.aiResponse.case_summaries || response.aiResponse.case_downloads) {
          const currentResponse = {
            case_analytics: response.aiResponse.case_analytics,
            case_downloads: response.aiResponse.case_downloads,
            case_summaries: response.aiResponse.case_summaries,
            processing_time: response.aiResponse.processing_time,
            query: response.aiResponse.query
          };
          
          setCurrentAIResponse(currentResponse);
        }
        
        // Save final state to localStorage
        if (currentSession) {
          localStorage.setItem(`lamis_ai_messages_${currentSession.sessionId}`, JSON.stringify(finalMessages));
          
          // Update session title if it's still "New Chat"
          if (currentSession.title === 'New Chat') {
            const newTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
            const updatedSession = { ...currentSession, title: newTitle, lastUpdated: new Date().toISOString() };
            const updatedSessions = sessions.map(s => s.sessionId === currentSession.sessionId ? updatedSession : s);
            setSessions(updatedSessions);
            setCurrentSession(updatedSession);
            localStorage.setItem('lamis_ai_sessions', JSON.stringify(updatedSessions));
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setAiStartedResponding(false);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        id: Date.now() + 1,
        isStreaming: false
      };
      
      const finalMessages = [...messages, errorMessage];
      setMessages(finalMessages);
      
      // Reset current AI response on error
      setCurrentAIResponse(null);
      
      // Save error state to localStorage
      if (currentSession) {
        localStorage.setItem(`lamis_ai_messages_${currentSession.sessionId}`, JSON.stringify(finalMessages));
      }
    } finally {
      setLoading(false);
      setStreamingMessageId(null);
      setAiStartedResponding(false);
    }
  };

  // Handler for suggested actions
  const handleSuggestedAction = (action) => {
    if (action.type === 'navigation') {
      navigate(action.path);
    } else {
      handleSend(action.action);
    }
  };

  // Function to get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    
    return `${greeting} ${user?.name || user?.given_name || 'User'}`;
  };

  const showWelcomeScreen = !currentSession || messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant');

  // Individual response vault handlers
  const handleSaveResponseToVault = (responseContent, userMessage) => {
    setSelectedResponse(responseContent);
    setSelectedUserMessage(userMessage);
    setShowSaveResponseToVault(true);
  };

  const handleResponseVaultSaveSuccess = () => {
    setShowSaveResponseToVault(false);
    setSelectedResponse(null);
    setSelectedUserMessage(null);
  };

  const handleResponseVaultCancel = () => {
    setShowSaveResponseToVault(false);
    setSelectedResponse(null);
    setSelectedUserMessage(null);
  };

  // Function to test if a URL is accessible
  const testUrlAccessibility = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('URL accessibility test failed:', error);
      return false;
    }
  };

  // Function to test Flask API connectivity
  const testFlaskAPIConnectivity = async () => {
    try {
      const response = await fetch('/flask-api/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Flask API connectivity test failed:', error);
      return false;
    }
  };

  // Function to handle case file downloads
  const handleCaseDownload = async (download) => {
    try {
      // Check if the URL is valid
      if (!download.url) {
        console.error('No download URL provided');
        return;
      }

      // Add to downloading set
      setDownloadingFiles(prev => new Set(prev).add(download.name));
      setDownloadStatus({ type: 'info', message: `Starting download of ${download.name}...` });

      // Check if this is a Flask API download and test connectivity first
      if (download.url.startsWith('/download/')) {
        const isFlaskRunning = await testFlaskAPIConnectivity();
        if (!isFlaskRunning) {
          console.error('Flask API is not running or not accessible');
          setDownloadStatus({ type: 'error', message: 'AI service is not running. Please start the Flask API server at localhost:6000' });
          return;
        }
      }

      // Construct the full URL to the Flask API
      let downloadUrl = download.url;
      if (download.url.startsWith('/download/')) {
        // This is a Flask API download URL, use the proxied URL
        downloadUrl = `/flask-api${download.url}`;
      } else if (download.url.startsWith('./') || download.url.startsWith('../')) {
        // Convert relative path to absolute path
        downloadUrl = `${window.location.origin}/Data/casefiles/${download.url.split('/').pop()}`;
      }

      // Ensure the filename has .pdf extension
      let filename = download.name || 'case-file.pdf';
      if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
      }

      console.log('Attempting to download:', { downloadUrl, filename });

      // Debug: Test the download endpoint first
      if (download.url.startsWith('/download/')) {
        const filenameOnly = download.url.split('/').pop();
        console.log('Debug: Testing download endpoint for filename:', filenameOnly);
        await testDownloadEndpoint(filenameOnly);
      }

      // Try to fetch the file first to ensure it's accessible
      try {
        const response = await fetch(downloadUrl);
        console.log('Fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          // Check if it's a JSON error response from Flask API
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('Flask API error response:', errorData);
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        
        // Get the blob from the response
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'Blob type:', blob.type);
        
        // Check if the blob is actually a PDF
        if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
          console.warn('Downloaded file is not a PDF:', blob.type);
          
          // If it's HTML, it might be an error page
          if (blob.type.includes('html') || blob.type.includes('text')) {
            const text = await blob.text();
            console.error('Received HTML/text response instead of PDF:', text.substring(0, 500));
            throw new Error('Server returned HTML instead of PDF file');
          }
        }
        
        // Create a blob URL for download
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        console.log('Download initiated successfully');
        setDownloadStatus({ type: 'success', message: `${download.name} downloaded successfully!` });
        
      } catch (fetchError) {
        console.log('Fetch failed, trying direct download:', fetchError);
        
        // Fallback to direct download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Direct download initiated');
        setDownloadStatus({ type: 'success', message: `${download.name} download initiated!` });
      }
    } catch (error) {
      console.error('Failed to download case file:', error);
      
      // Provide more specific error messages
      let errorMessage = `Failed to download ${download.name}`;
      if (error.message.includes('Case files directory not found')) {
        errorMessage = 'AI service cannot find case files directory. Please check server configuration.';
      } else if (error.message.includes('Case file not found')) {
        errorMessage = `The case file "${download.name}" was not found on the server.`;
      } else if (error.message.includes('Server returned HTML instead of PDF')) {
        errorMessage = 'Server returned an error page instead of the PDF file. Please check if the AI service is running.';
      } else if (error.message.includes('Flask AI service is not running')) {
        errorMessage = 'AI service is not running. Please start the Flask API server at http://localhost:6000';
      }
      
      setDownloadStatus({ type: 'error', message: errorMessage });
      
      // Try to test if the URL is accessible
      const isAccessible = await testUrlAccessibility(downloadUrl);
      console.log('URL accessibility test result:', isAccessible);
      
      if (isAccessible) {
        // If accessible, try to open in new tab
        try {
          console.log('Attempting to open in new tab:', downloadUrl);
          window.open(downloadUrl, '_blank');
          setDownloadStatus({ type: 'info', message: `Opened ${download.name} in new tab` });
        } catch (fallbackError) {
          console.error('Failed to open case file in new tab:', fallbackError);
          setDownloadStatus({ type: 'error', message: `Failed to open ${download.name}` });
        }
      } else {
        // If not accessible, try the original URL with proper Flask API URL construction
        try {
          let fallbackUrl = download.url;
          if (download.url.startsWith('/download/')) {
            fallbackUrl = `/flask-api${download.url}`;
          }
          console.log('Attempting to open fallback URL in new tab:', fallbackUrl);
          window.open(fallbackUrl, '_blank');
          setDownloadStatus({ type: 'info', message: `Opened ${download.name} in new tab` });
        } catch (fallbackError) {
          console.error('Failed to open case file in new tab:', fallbackError);
          setDownloadStatus({ type: 'error', message: `Failed to open ${download.name}` });
        }
      }
    } finally {
      // Remove from downloading set
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(download.name);
        return newSet;
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(null);
      }, 3000);
    }
  };

  // Test function to verify Flask API response
  const testFlaskAPI = async () => {
    try {
      const response = await fetch('/flask-api/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'test case law',
          include_ai_response: true,
          include_graphs: true
        })
      });
      
      const data = await response.json();
      if (import.meta.env.DEV) {
        // console.debug('Flask API test executed');
      }
      
      return data;
    } catch (error) {
      console.error('Flask API test failed:', error);
    }
  };

  // Test function to debug download endpoint
  const testDownloadEndpoint = async (filename) => {
    try {
      console.log('Testing download endpoint for:', filename);
      const response = await fetch(`/flask-api/download/${filename}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/json,*/*'
        }
      });
      
      console.log('Download test response status:', response.status);
      console.log('Download test response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Download test error response:', errorData);
        } else {
          const text = await response.text();
          console.error('Download test error text:', text.substring(0, 500));
        }
      } else {
        const blob = await response.blob();
        console.log('Download test success - blob size:', blob.size, 'blob type:', blob.type);
      }
      
      return response.ok;
    } catch (error) {
      console.error('Download test failed:', error);
      return false;
    }
  };

  // Test function to check Flask API status
  const testFlaskAPIStatus = async () => {
    try {
      console.log('Testing Flask API status...');
      
      // Test health endpoint
      const healthResponse = await fetch('/flask-api/api/health');
      console.log('Health endpoint status:', healthResponse.status);
      
      // Test status endpoint
      const statusResponse = await fetch('/flask-api/api/status');
      console.log('Status endpoint status:', statusResponse.status);
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('Flask API status:', statusData);
      }
      
      return healthResponse.ok && statusResponse.ok;
    } catch (error) {
      console.error('Flask API status test failed:', error);
      return false;
    }
  };

  // Test function to verify frontend rendering with mock sources
  const testSourcesRendering = () => {
    const mockResponse = {
      aiResponse: {
        answer: "This is a test response with sources. The legal requirements for search and seizure are complex and vary by jurisdiction. Key principles include probable cause, reasonable suspicion, and the exclusionary rule.",
        sources: [
          "https://www.law.cornell.edu/supct/cases/name/roe_v_wade",
          "https://www.oyez.org/cases/1971/70-18",
          "California Penal Code Section 187",
          "Federal Rules of Evidence Rule 401"
        ],

        case_summaries: [],
        case_downloads: [],
        case_analytics: {
          has_cases: false,
          message: "No relevant cases found",
          total_cases_in_db: 35,
          threshold_used: 0.3
        },
        processing_time: 2.1,
        query: "test sources"
      }
    };
    console.log('Testing sources rendering with mock data:', mockResponse);
    const userMessage = {
      role: 'user',
      content: 'Test sources query',
      id: Date.now() + Math.random(),
      isStreaming: false
    };
    const assistantMessage = {
      role: 'assistant',
      content: mockResponse.aiResponse.answer,
      id: Date.now() + 1,
      isStreaming: false,
      sources: mockResponse.aiResponse.sources,
      caseDownloads: mockResponse.aiResponse.case_downloads,
      caseSummaries: mockResponse.aiResponse.case_summaries,
      analytics: mockResponse.aiResponse.case_analytics,

    };
    const testMessages = [userMessage, assistantMessage];
    setMessages(testMessages);
    console.log('Mock sources test completed - check the UI for sources');
  };

  // Test function to verify frontend rendering with mock case summaries
  const testCaseSummaryRendering = () => {
    const mockResponse = {
      aiResponse: {
        answer: "This is a test response with case summaries.",
        case_summaries: [
          {
            case_name: "People v. Smith",
            case_number: "CR-2023-001",
            original_case_name: "People v. Smith (2023)",
            relevance_score: 0.85,
            summary_points: [
              "The court held that evidence obtained through illegal search and seizure must be excluded.",
              "The defendant's motion to suppress evidence was granted.",
              "The case established important precedent for Fourth Amendment protections."
            ],
            relevance_note: "Highly relevant to search and seizure issues",
            download_url: "/download/People_v_Smith.pdf",
            topics: ["Search and Seizure", "Fourth Amendment"],
            legal_principles: ["Exclusionary Rule", "Probable Cause"],
            analysis_quality: "high",
            case_text_length: 1500
          },
          {
            case_name: "California v. Johnson",
            case_number: "CR-2023-002", 
            original_case_name: "California v. Johnson (2023)",
            relevance_score: 0.72,
            summary_points: [
              "The court ruled on the admissibility of DNA evidence in criminal trials.",
              "Established standards for DNA evidence authentication.",
              "Set precedent for scientific evidence requirements."
            ],
            relevance_note: "Relevant to DNA evidence procedures",
            download_url: "/download/California_v_Johnson.pdf",
            topics: ["DNA Evidence", "Scientific Evidence"],
            legal_principles: ["Authentication", "Scientific Standards"],
            analysis_quality: "medium",
            case_text_length: 1200
          }
        ],
        case_downloads: [
          {
            name: "People_v_Smith.pdf",
            url: "/download/People_v_Smith.pdf",
            size: "2.3 MB"
          },
          {
            name: "California_v_Johnson.pdf", 
            url: "/download/California_v_Johnson.pdf",
            size: "1.8 MB"
          }
        ],
        case_analytics: {
          has_cases: true,
          message: "Found relevant cases for analysis",
          total_cases_in_db: 35,
          threshold_used: 0.3
        },
        processing_time: 5.2,
        query: "test case law"
      }
    };

    console.log('Testing case summary rendering with mock data:', mockResponse);
    
    // Simulate the response processing
    const userMessage = { 
      role: 'user', 
      content: 'Test query',
      id: Date.now() + Math.random(),
      isStreaming: false
    };
    
    const assistantMessage = {
      role: 'assistant',
      content: mockResponse.aiResponse.answer,
      id: Date.now() + 1,
      isStreaming: false,
      sources: [],
      caseDownloads: mockResponse.aiResponse.case_downloads,
      caseSummaries: mockResponse.aiResponse.case_summaries,
      analytics: mockResponse.aiResponse.case_analytics
    };
    
    const testMessages = [userMessage, assistantMessage];
    setMessages(testMessages);
    
    // Set current AI response for analytics tab
    const currentResponse = {
      case_analytics: mockResponse.aiResponse.case_analytics,
      case_downloads: mockResponse.aiResponse.case_downloads,
      case_summaries: mockResponse.aiResponse.case_summaries,
      processing_time: mockResponse.aiResponse.processing_time,
      query: mockResponse.aiResponse.query
    };
    setCurrentAIResponse(currentResponse);
    
    console.log('Mock test completed - check the UI for case summaries');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
      
      {/* Download Status Notification */}
      {downloadStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          downloadStatus.type === 'success' 
            ? 'bg-green-500 text-white' 
            : downloadStatus.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {downloadStatus.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {downloadStatus.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {downloadStatus.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{downloadStatus.message}</span>
          </div>
        </div>
      )}
      
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 dark:bg-neutral-950/80 border border-gray-200 dark:border-neutral-800 rounded-full p-2 shadow"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar menu"
      >
        <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* SidebarDrawer for mobile view, preserving original logic */}
      <SidebarDrawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onNewChat={async () => {
          const newSession = await backendAIService.startSession();
          const updatedSessions = [newSession, ...sessions];
          setSessions(updatedSessions); // <-- Update sessions after new chat
          setCurrentSession(newSession);
          setAiStartedResponding(false);
          setMessages([{ 
            role: 'assistant', 
            content: 'Hi! How can I help you today?',
            id: Date.now(),
            isStreaming: false
          }]);
          setDrawerOpen(false); // Close drawer on new chat
        }}
        onDeleteSession={handleDeleteSession}
        onClearHistory={handleClearHistory}
      />

      {/* Main Layout with proper spacing for navbar */}
      <div className="flex h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white relative overflow-hidden">
        {/* Sidebars for desktop, hidden on mobile */}
        <div className="hidden md:flex" style={{ position: 'fixed', top: 0, left: 0, zIndex: 40, height: '100vh' }}>
          <MainSidebar
            expanded={mainSidebarExpanded}
            setExpanded={setMainSidebarExpanded}
          />
          <Sidebar 
            sessions={sessions}
            currentSession={currentSession}
            onSessionSelect={handleSessionSelect}
            onNewChat={async () => {
              const newSession = await backendAIService.startSession();
              const updatedSessions = [newSession, ...sessions];
              setSessions(updatedSessions); // <-- Update sessions after new chat
              setCurrentSession(newSession);
              setAiStartedResponding(false);
              setMessages([{ 
                role: 'assistant', 
                content: 'Hi! How can I help you today?',
                id: Date.now(),
                isStreaming: false
              }]);
            }}
            onClearHistory={handleClearHistory}
            onDeleteSession={handleDeleteSession}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: mainSidebarExpanded ? '16rem' : '4rem', 
              zIndex: 30, 
              transition: 'left 300ms ease-in-out',
              height: '100vh'
            }}
          />
        </div>
        
        {/* Main Content Area with responsive margin and transitions */}
        <div 
          className={`flex flex-col flex-grow min-w-0 transition-all duration-300 ease-in-out md:ml-[20rem] ${mainSidebarExpanded ? 'md:ml-[28rem]' : 'md:ml-[20rem]'}`}
        >
          {/* Tab Navigation */}
          {currentAIResponse && currentAIResponse.case_analytics && (
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex px-4 sm:px-6">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'chat'
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-transparent'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'analytics'
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-transparent'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </button>
              </div>
            </div>
          )}

          <div className="flex-grow flex flex-col relative overflow-hidden w-full">
            {activeTab === 'analytics' && currentAIResponse && currentAIResponse.case_analytics ? (
              // Analytics Content
              <div className="px-4 sm:px-6 py-4 overflow-y-auto">
                <div className="w-full max-w-6xl mx-auto space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Case Analytics
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Analysis of relevant cases and their similarity scores
                    </p>
                  </div>

                  {/* Analytics Summary */}
                  <CaseAnalyticsSummary 
                    caseAnalytics={currentAIResponse.case_analytics}
                    className="mb-6"
                  />

                  {/* Charts Dashboard */}
                  <AnalyticsDashboard 
                    caseAnalytics={currentAIResponse.case_analytics}
                    className="space-y-8"
                  />

                  {/* Query Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Query Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Query:</h4>
                        <p className="text-gray-600 dark:text-gray-400">{currentAIResponse.query}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Processing Time:</h4>
                        <p className="text-gray-600 dark:text-gray-400">{currentAIResponse.processing_time.toFixed(3)} seconds</p>
                      </div>
                      {((currentAIResponse.case_downloads && currentAIResponse.case_downloads.length > 0) || (currentAIResponse.case_summaries && currentAIResponse.case_summaries.length > 0)) && (
                        <div>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Case Downloads & Summaries:</h4>
                          <div className="space-y-3 mt-2">
                            {/* Render downloads with summaries */}
                            {currentAIResponse.case_downloads && currentAIResponse.case_downloads.map((download, index) => {
                              // Find corresponding summary for this download
                              const correspondingSummary = currentAIResponse.case_summaries ? 
                                currentAIResponse.case_summaries.find(summary => 
                                  summary.download_url === download.url || 
                                  summary.case_name === download.name
                                ) : null;
                              
                              // Debug logging
                              if (import.meta.env.DEV) {
                                // console.log('Analytics tab - Download:', download);
                                // console.log('Analytics tab - Corresponding summary:', correspondingSummary);
                              }
                              
                              return (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                  {/* Case Download */}
                                  <div className="mb-2">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                      Case File
                                    </h5>
                                    <button 
                                      onClick={() => handleCaseDownload(download)}
                                      disabled={downloadingFiles.has(download.name)}
                                      className={`flex items-center gap-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200 ${
                                        downloadingFiles.has(download.name) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                      }`}
                                    >
                                      {downloadingFiles.has(download.name) ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                                      ) : (
                                        <Download className="h-4 w-4" />
                                      )}
                                      {downloadingFiles.has(download.name) ? 'Downloading...' : download.name}
                                    </button>
                                  </div>
                                  
                                  {/* Case Summary */}
                                  {correspondingSummary && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        Case Summary
                                      </h5>
                                      <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                        <div className="flex items-start justify-between mb-1">
                                          <h6 className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {correspondingSummary.case_name}
                                          </h6>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Score: {(correspondingSummary.relevance_score * 100).toFixed(1)}%
                                          </span>
                                        </div>
                                        {correspondingSummary.case_number && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            Case Number: {correspondingSummary.case_number}
                                          </p>
                                        )}
                                        {correspondingSummary.original_case_name && (
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            Original Case: {correspondingSummary.original_case_name}
                                          </p>
                                        )}
                                        <div className="space-y-1">
                                          {correspondingSummary.summary_points && correspondingSummary.summary_points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="flex items-start gap-2">
                                              <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5 text-xs">•</span>
                                              <span className="text-xs text-gray-700 dark:text-gray-300">{point}</span>
                                            </div>
                                          ))}
                                        </div>
                                        {correspondingSummary.relevance_note && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                            {correspondingSummary.relevance_note}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            
                            {/* Render summaries without downloads */}
                            {currentAIResponse.case_summaries && currentAIResponse.case_summaries.filter(summary => {
                              // Only show summaries that don't have a corresponding download
                              return !currentAIResponse.case_downloads || !currentAIResponse.case_downloads.find(download => 
                                summary.download_url === download.url || 
                                summary.case_name === download.name
                              );
                            }).map((summary, index) => {
                              // Debug logging
                              if (import.meta.env.DEV) {
                                // console.log('Analytics tab - Summary without download:', summary);
                              }
                              
                              return (
                                <div key={`summary-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                      Case Summary
                                    </h5>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                      <div className="flex items-start justify-between mb-1">
                                        <h6 className="text-sm font-semibold text-gray-900 dark:text-white">
                                          {summary.case_name}
                                        </h6>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Score: {(summary.relevance_score * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                      {summary.case_number && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                          Case Number: {summary.case_number}
                                        </p>
                                      )}
                                      {summary.original_case_name && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                          Original Case: {summary.original_case_name}
                                        </p>
                                      )}
                                      <div className="space-y-1">
                                        {summary.summary_points && summary.summary_points.map((point, pointIndex) => (
                                          <div key={pointIndex} className="flex items-start gap-2">
                                            <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5 text-xs">•</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300">{point}</span>
                                          </div>
                                        ))}
                                      </div>
                                      {summary.relevance_note && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                          {summary.relevance_note}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Chat Content - Gemini Style
              <div className="flex flex-col h-full bg-white dark:bg-[#121212]">
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 bg-white dark:bg-[#121212]" style={{ paddingBottom: '180px' }}>
                                     {showWelcomeScreen ? (
                     <div className="flex flex-col items-center justify-center h-full">
                       <div className="text-center max-w-2xl mx-auto">
                         <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-6">
                           {getGreeting()}
                         </h1>
                         <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                           I'm your AI legal assistant. How can I help you with your legal questions and research today?
                         </p>
                       </div>
                     </div>
                  ) : (
                    <div className="max-w-3xl mx-auto space-y-8">
                      {messages.map((msg, idx) => {
                        const userMessage = msg.role === 'assistant' && idx > 0 ? messages[idx - 1]?.content : null;
                        
                        return (
                          <div key={msg.id || idx} className="flex flex-col space-y-2">
                            {/* Message Header */}
                            <div className={`flex items-center gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {msg.role === 'assistant' && (
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                              )}
                              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                {msg.role === 'user' ? 'You' : 'LAMA AI'}
                              </span>
                              {msg.role === 'user' && (
                                <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-neutral-600 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Message Content */}
                            <div className={`${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-full`}>
                              <div className={` ${
                                msg.role === 'user'
                                  ? 'text-white'
                                  : msg.role === 'error'
                                  ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
                                  : ''
                              }`}>
                                <div 
                                  dangerouslySetInnerHTML={{ 
                                    __html: enhanceLinksInHtml(convertMarkdownToHtml(msg.content)) 
                                  }}
                                />
                                

                                {msg.isStreaming && msg.content && msg.content.trim() !== '' && <span className="animate-pulse">|</span>}
                                
                                {/* Render charts if analytics data is available */}
                                {msg.analytics && msg.analytics.case_analytics && (
                                  <div className="mt-6">
                                    <div className="mb-4">
                                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        Case Analytics
                                      </h3>
                                      <p className="text-gray-600 dark:text-gray-300">
                                        Analysis of relevant cases and their similarity scores
                                      </p>
                                    </div>
                                    
                                    {/* Analytics Summary */}
                                    <CaseAnalyticsSummary 
                                      caseAnalytics={msg.analytics.case_analytics}
                                      className="mb-6"
                                    />
                                    
                                    {/* Charts Dashboard */}
                                    <AnalyticsDashboard 
                                      caseAnalytics={msg.analytics.case_analytics}
                                      className="space-y-8"
                                    />
                                  </div>
                                )}

                                {/* Render sources if available - One by one display with streaming effect */}
                                {msg.sources && msg.sources.length > 0 && (
                                  <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Sources</h3>
                                    <div className="space-y-2">
                                      {msg.sources.slice(0, displayedSources.length).map((source, index) => (
                                        <div key={index} className="flex items-start space-x-2 text-gray-600 dark:text-gray-400 animate-fadeIn">
                                          <span className="text-purple-500 font-medium mt-0.5">•</span>
                                          <span className="flex-1">{source}</span>
                                        </div>
                                      ))}
                                      {msg.isStreaming && displayedSources.length < msg.sources.length && (
                                        <div className="flex items-start space-x-2 text-gray-400 dark:text-gray-500">
                                          <span className="text-purple-500 font-medium mt-0.5">•</span>
                                          <span className="flex-1 animate-pulse">Loading next source...</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Debug logging for sources */}
                                {import.meta.env.DEV && (
                                  <>
                                    {console.log('Rendering message sources:', msg.sources)}
                                    {console.log('Message object:', msg)}
                                  </>
                                )}

                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {loading && !aiStartedResponding && <ThinkingAnimation />}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                                 {/* Compact Action Buttons - Above Input - Only show when no user messages */}
                 {messages.filter(msg => msg.role === 'user').length === 0 && (
                  <div className="absolute bottom-32 left-0 right-0 z-20 bg-transparent py-3">
                    <div className="max-w-4xl mx-auto px-6">
                      <div className="flex justify-center items-center gap-6">
                        <button
                          onClick={() => navigate('/docs-interaction/upload')}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md" 
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Docs Interaction
                          </div>
                        </button>
                        <button
                          onClick={() => navigate('/documents-drafting')}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Document Drafting
                          </div>
                        </button>
                        <button
                          onClick={testFlaskAPI}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Test API
                          </div>
                        </button>
                        <button
                          onClick={testFlaskAPIStatus}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Test Flask Status
                          </div>
                        </button>
                        <button
                          onClick={testCaseSummaryRendering}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Test Case Summaries
                          </div>
                        </button>
                        <button
                          onClick={testSourcesRendering}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Test Sources
                          </div>
                        </button>
                        <button
                          onClick={() => testDownloadEndpoint('People_v._Montes.pdf')}
                          className="group px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ backgroundColor: '#121212' }}
                        >
                          <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                            Test Download
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Input Box - Gemini Style */}
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-[#121212] pt-6 pb-6 border-t border-transparent">
                  <div className="max-w-4xl mx-auto px-6">
                    <AIAssistanceInput onSend={handleSend} isLoading={loading} aiResponding={aiStartedResponding} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Response to Vault Modal */}
      <SaveResponseToVault
        responseContent={selectedResponse}
        userMessage={selectedUserMessage}
        feature="ai-assistance"
        onSave={handleResponseVaultSaveSuccess}
        onCancel={handleResponseVaultCancel}
        isVisible={showSaveResponseToVault}
      />
    </div>
  );
};

export default AIAssistanceView;