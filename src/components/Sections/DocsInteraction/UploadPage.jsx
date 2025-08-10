import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MainSidebar from '../AIAssistance/MainSidebar';
import AIAssistanceInput from '../AIAssistance/AIAssistanceInput';
import SaveResponseToVault from '../Vault/SaveResponseToVault';
import DocsInteractionSidebar from './DocsInteractionSidebar';
import DocsInteractionDrawer from './DocsInteractionDrawer';
import { Save } from 'lucide-react';
import docsInteractionService from './docsInteractionService';

// Loading animation component to replace the single line
const ThinkingAnimation = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 sm:px-4 sm:py-3 max-w-[90%] sm:max-w-[85%] shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
            </div>
        </div>
    );
};

const UploadPage = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [file, setFile] = useState(null);
    const [chatMode, setChatMode] = useState(false);
    const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content: string, ...}
    const [documentId, setDocumentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSaveResponseToVault, setShowSaveResponseToVault] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [selectedUserMessage, setSelectedUserMessage] = useState(null);
    
    // Session management state - only for history sidebar
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [showHistorySidebar, setShowHistorySidebar] = useState(false);
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load sessions on component mount
    useEffect(() => {
        loadSessions();
    }, []);

    // Load all document sessions
    const loadSessions = async () => {
        try {
            const sessionsData = await docsInteractionService.getSessions();
            setSessions(sessionsData);
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    };

    // Load data for a specific session
    const loadSessionData = async (session) => {
        try {
            const sessionData = await docsInteractionService.getSession(session.sessionId);
            setCurrentSession(sessionData);
            setDocumentId(sessionData._id);
            
            // Convert chat history to message format
            const formattedMessages = sessionData.chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content,
                references: msg.references,
                query: msg.query,
                doc_id: msg.doc_id,
                query_type: msg.query_type,
                timestamp: msg.timestamp
            }));
            
            setMessages(formattedMessages);
            setChatMode(true);
            
            // Create a mock file object for display purposes
            if (sessionData.metadata) {
                const mockFile = {
                    name: sessionData.documentName,
                    type: sessionData.metadata.fileType,
                    size: sessionData.metadata.size
                };
                setFile(mockFile);
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    };

    // Handle file upload - ORIGINAL FUNCTIONALITY
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setChatMode(false);
            setMessages([]);
            setError('');
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setChatMode(false);
            setMessages([]);
            setError('');
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Start chat mode after file upload - ORIGINAL FUNCTIONALITY
    const handleStartChat = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a document to start.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentName', file.name || 'newDocument');
            // Optionally add metadata here
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in to use this feature');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/document-interaction/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload document');
            }
            const data = await response.json();
            setDocumentId(data.documentId);
            setChatMode(true);
            setMessages([
                { role: 'assistant', content: 'Document uploaded! You can now ask any question about this document.' }
            ]);
            
            // Reload sessions to get the new session
            await loadSessions();
        } catch (err) {
            setError(err.message || 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    // Handle sending a question in chat mode - ORIGINAL FUNCTIONALITY
    const handleSend = async (question) => {
        if (!documentId || !question.trim()) return;
        setLoading(true);
        setError('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in to use this feature');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/document-interaction/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    documentId,
                    message: question
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get answer from AI');
            }
            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || data.content || '',
                references: data.references,
                query: data.query,
                doc_id: data.doc_id,
                query_type: data.query_type
            }]);
            
            // Reload sessions to update the current session
            await loadSessions();
        } catch (err) {
            setError(err.message || 'Failed to process document chat');
            setMessages(prev => [...prev, { role: 'error', content: err.message || 'AI Q&A failed' }]);
        } finally {
            setLoading(false);
        }
    };

    // Session management handlers - ONLY FOR HISTORY SIDEBAR
    const handleNewChat = () => {
        setCurrentSession(null);
        setFile(null);
        setMessages([]);
        setError('');
        setChatMode(false);
        setDocumentId(null);
    };

    const handleSessionSelect = async (session) => {
        await loadSessionData(session);
    };

    const handleDeleteSession = async (session) => {
        try {
            await docsInteractionService.deleteSession(session.sessionId);
            await loadSessions();
            
            // If the deleted session was the current one, clear the current session
            if (currentSession?.sessionId === session.sessionId) {
                setCurrentSession(null);
                setFile(null);
                setMessages([]);
                setChatMode(false);
                setDocumentId(null);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const handleClearHistory = async () => {
        try {
            // Delete all sessions
            const deletePromises = sessions.map(session => 
                docsInteractionService.deleteSession(session.sessionId)
            );
            await Promise.all(deletePromises);
            
            setSessions([]);
            setCurrentSession(null);
            setFile(null);
            setMessages([]);
            setChatMode(false);
            setDocumentId(null);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    // Individual response vault handlers - ORIGINAL FUNCTIONALITY
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

    return (
        <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <MainSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
                </div>
                
                {/* Hamburger for mobile - positioned like AI Assistance */}
                <button
                    className="md:hidden fixed top-4 left-4 z-50 bg-white/80 dark:bg-neutral-950/80 border border-gray-200 dark:border-neutral-800 rounded-full p-2 shadow"
                    onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                    aria-label="Open sidebar menu"
                >
                    <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                {/* Mobile Drawer */}
                <DocsInteractionDrawer
                    open={showHistorySidebar}
                    onClose={() => setShowHistorySidebar(false)}
                    onNewChat={handleNewChat}
                    onDeleteSession={handleDeleteSession}
                    onClearHistory={handleClearHistory}
                    sessions={sessions}
                    currentSession={currentSession}
                    onSessionSelect={handleSessionSelect}
                />
                
                {/* Desktop History Sidebar */}
                <div className="hidden md:block fixed top-0 z-30 h-screen"
                    style={{
                        left: sidebarExpanded ? '256px' : '64px',
                        width: '256px'
                    }}
                >
                    <DocsInteractionSidebar
                        sessions={sessions}
                        currentSession={currentSession}
                        onSessionSelect={handleSessionSelect}
                        onNewChat={handleNewChat}
                        onClearHistory={handleClearHistory}
                        onDeleteSession={handleDeleteSession}
                    />
                </div>
                

                
                <main className={`flex flex-1 w-full h-screen transition-all duration-300 ${
                    sidebarExpanded ? 'md:ml-64' : 'md:ml-16'
                } md:ml-80`}>
                    <div className="w-full flex justify-center items-center p-4 md:p-8 overflow-y-auto">
                        {!chatMode ? (
                            <form className="flex flex-col items-center w-full max-w-xl px-4" onSubmit={handleStartChat}>
                                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Ask Questions About Your Legal Document</h1>
                                <div
                                    className={`flex flex-col items-center justify-center h-32 md:h-40 w-full max-w-md mx-auto border-2 border-dashed border-purple-500 rounded-lg bg-gray-50 dark:bg-transparent cursor-pointer mb-4 transition hover:border-purple-400 ${file ? 'py-4 md:py-6' : 'py-8 md:py-12'}`}
                                    onClick={() => fileInputRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v-4m0 0l-3 3m3-3l3 3" /></svg>
                                    <span className="text-base font-medium text-purple-600 dark:text-purple-300 mb-2 text-center px-4">{file ? 'File Selected:' : 'Click or Drag & Drop to Upload'}</span>
                                    {file && <span className="text-gray-900 dark:text-white text-sm mt-1 truncate max-w-[80%] text-center">{file.name}</span>}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                </div>
                                {loading ? (
                                    <button
                                        type="button"
                                        className="px-8 py-3 bg-purple-400 text-white font-semibold rounded-lg shadow-md mb-4 flex items-center justify-center cursor-not-allowed opacity-80"
                                        disabled
                                    >
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Uploading...
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 mb-4"
                                    >
                                        Start Chat
                                    </button>
                                )}
                                {error && <div className="mt-2 text-red-400 text-center">{error}</div>}
                            </form>
                        ) : (
                            <div className="flex flex-col w-full h-full max-w-4xl mx-auto">
                                <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4">
                                    <div className="max-w-4xl mx-auto space-y-4">
                                        {messages.map((msg, idx) => {
                                            // Find the corresponding user message for AI responses
                                            const userMessage = msg.role === 'assistant' && idx > 0 ? messages[idx - 1]?.content : null;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 max-w-[90%] sm:max-w-[85%] break-words shadow-md text-xs sm:text-sm md:text-base ${
                                                            msg.role === 'user'
                                                                ? 'bg-purple-600 text-white self-end'
                                                                : msg.role === 'error'
                                                                ? 'bg-red-600 text-white self-start'
                                                                : 'bg-neutral-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 self-start'
                                                        }`}
                                                    >
                                                        {msg.role === 'assistant' ? (
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    h1: ({node, ...props}) => <h1 className="text-4xl underline font-extrabold mt-3 mb-1" {...props} />,
                                                                    h2: ({node, ...props}) => <h2 className="text-2xl underline font-bold mt-2 mb-2" {...props} />,
                                                                    h3: ({node, ...props}) => <h3 className="text-lg underline font-italic mt-2 mb-2" {...props} />,
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        ) : (
                                                            <div>{msg.content}</div>
                                                        )}
                                                        {/* Show references if present */}
                                                        {msg.references && Array.isArray(msg.references) && msg.references.length > 0 && (
                                                            <div className="mt-3 text-[10px] text-purple-600">
                                                                <strong>References:</strong> {msg.references.join(', ')}
                                                            </div>
                                                        )}
                                                        {/* Individual vault button for AI responses */}
                                                        {msg.role === 'assistant' && msg.content && (
                                                            <div className="mt-3 flex justify-end">
                                                                <button
                                                                    onClick={() => handleSaveResponseToVault(msg.content, userMessage)}
                                                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                                                    title="Save this response to vault"
                                                                >
                                                                    <Save className="h-3 w-3" />
                                                                    Save Response
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {loading && <ThinkingAnimation />}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                <div className="px-4 pb-4">
                                    <AIAssistanceInput onSend={handleSend} isLoading={loading} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Save Response to Vault Modal */}
            <SaveResponseToVault
                responseContent={selectedResponse}
                userMessage={selectedUserMessage}
                feature="document-interaction"
                onSave={handleResponseVaultSaveSuccess}
                onCancel={handleResponseVaultCancel}
                isVisible={showSaveResponseToVault}
            />
        </div>
    );
};

export default UploadPage;
