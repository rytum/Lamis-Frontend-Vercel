import React, { useRef, useState, useEffect } from 'react';
import { marked } from 'marked';
import './DocumentChatPage.css';
import MainSidebar from '../AIAssistance/MainSidebar';
import AIAssistanceInput from '../AIAssistance/AIAssistanceInput';
import SaveToVault from '../Vault/SaveToVault';
import DocsInteractionSidebar from './DocsInteractionSidebar';
import DocsInteractionDrawer from './DocsInteractionDrawer';
import { Save, FolderOpen, BarChart3, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enhanceLinksInHtml } from '../../../utils/linkUtils';
import { AnalyticsDashboard, CaseAnalyticsSummary } from '../AIAssistance/ChartComponents';
import docsInteractionService from './docsInteractionService';

// Loading animation component to replace the single line
const ThinkingAnimation = () => {
    return (
        <div className="flex justify-start mb-2">
            <div className="bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-xl px-3 py-2 sm:px-4 max-w-[85%] sm:max-w-[80%] shadow-md">
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

const DocumentChatPage = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSaveToVault, setShowSaveToVault] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [currentAnalytics, setCurrentAnalytics] = useState(null);
    
    // Session management state
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [showHistorySidebar, setShowHistorySidebar] = useState(true); // Always show by default
    
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

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
            
            // If there are sessions and no current session, select the most recent one
            if (sessionsData.length > 0 && !currentSession) {
                setCurrentSession(sessionsData[0]);
                await loadSessionData(sessionsData[0]);
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    };

    // Load data for a specific session
    const loadSessionData = async (session) => {
        try {
            const sessionData = await docsInteractionService.getSession(session.sessionId);
            setCurrentSession(sessionData);
            
            // Convert chat history to message format
            const formattedMessages = sessionData.chatHistory.map(msg => ({
                role: msg.role,
                content: msg.role === 'assistant' && msg.content.includes('<') 
                    ? msg.content 
                    : msg.role === 'assistant' 
                        ? marked.parse(msg.content || '')
                        : msg.content,
                isHtml: msg.role === 'assistant' && msg.content.includes('<'),
                timestamp: msg.timestamp
            }));
            
            setMessages(formattedMessages);
            
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

    // Handle file upload
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            const allowedTypes = [
                'text/plain',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Invalid file type. Only .txt, .pdf, .doc, and .docx files are allowed.');
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
                setError('File size too large. Maximum size is 5MB.');
                return;
            }
            setFile(selectedFile);
            setMessages([
                { role: 'assistant', content: 'Document uploaded! You can now ask any question about this document.' }
            ]);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            const allowedTypes = [
                'text/plain',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            if (!allowedTypes.includes(droppedFile.type)) {
                setError('Invalid file type. Only .txt, .pdf, .doc, and .docx files are allowed.');
                return;
            }
            
            if (droppedFile.size > 5 * 1024 * 1024) { // 5MB
                setError('File size too large. Maximum size is 5MB.');
                return;
            }
            
            setFile(droppedFile);
            setMessages([
                { role: 'assistant', content: 'Document uploaded! You can now ask any question about this document.' }
            ]);
            setError('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Handle sending a question in chat mode
    const handleSend = async (question) => {
        if (!file || !question.trim()) return;
        setLoading(true);
        setError('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);

        try {
            let documentId = currentSession?._id;

            // If no current session, upload the document first
            if (!documentId) {
                const uploadResult = await docsInteractionService.uploadDocument(file, file.name);
                documentId = uploadResult.documentId;
                
                // Reload sessions to get the new session
                await loadSessions();
            }

            // Send the message
            const response = await docsInteractionService.sendMessage(documentId, question);
            
            // Render the AI response as Markdown
            let formatted = marked.parse(response.answer || response.response || '');
            
            // Enhance links with better styling and ensure they're clickable
            formatted = enhanceLinksInHtml(formatted);
            
            setMessages(prev => [...prev, { role: 'assistant', content: formatted, isHtml: true }]);
            
            // Reload sessions to update the current session
            await loadSessions();
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'error', content: err.message || 'AI Q&A failed' }]);
            setError(err.message || 'Failed to process document chat');
        } finally {
            setLoading(false);
        }
    };

    // Session management handlers
    const handleNewChat = () => {
        setCurrentSession(null);
        setFile(null);
        setMessages([]);
        setError('');
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
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    // Vault handlers
    const handleSaveToVault = () => {
        setShowSaveToVault(true);
    };

    const handleVaultSaveSuccess = () => {
        setShowSaveToVault(false);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Chat saved to vault successfully!'
        }]);
    };

    const handleVaultCancel = () => {
        setShowSaveToVault(false);
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-black text-gray-900 dark:text-white">
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
            <div className="hidden md:block fixed top-0 z-40 h-screen"
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
            

            
            <main className={`flex-1 flex flex-col transition-all duration-300 ${
                sidebarExpanded ? 'md:ml-64' : 'md:ml-16'
            } md:ml-80 h-screen`}>
                <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-8 overflow-y-auto w-full">
                    {!file ? (
                        <div className="flex flex-col items-center w-full max-w-2xl px-4">
                            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Upload a Legal Document to Start Chat</h1>
                            
                            <div
                                className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-purple-500 rounded-lg bg-gray-50 dark:bg-gray-900 cursor-pointer mb-4 transition hover:border-purple-400 py-8 md:py-16`}
                                onClick={() => fileInputRef.current.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v-4m0 0l-3 3m3-3l3 3" /></svg>
                                <span className="text-lg font-medium text-purple-600 dark:text-purple-300 mb-2">Click or Drag & Drop to Upload</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                            </div>
                            {error && <div className="mt-2 text-red-400 text-center">{error}</div>}
                        </div>
                    ) : (
                        <div className="flex flex-col w-full max-w-2xl mx-auto h-full">
                            {/* Header with document info and controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Document: {file.name}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {messages.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleSaveToVault}
                                                className="flex items-center gap-2 px-2 py-1 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                                title="Save this conversation to vault"
                                            >
                                                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="hidden sm:inline">Save to Vault</span>
                                                <span className="sm:hidden">Save</span>
                                            </button>
                                            <button
                                                onClick={() => navigate('/vault')}
                                                className="flex items-center gap-2 px-2 py-1 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                title="View vaulted chats"
                                            >
                                                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="hidden sm:inline">View Vault</span>
                                                <span className="sm:hidden">Vault</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pb-4">
                                <div className="max-w-2xl mx-auto space-y-2">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`markdown-chat rounded-xl px-3 py-2 sm:px-4 max-w-[85%] sm:max-w-[80%] break-words shadow-md text-xs sm:text-sm md:text-base ${
                                                    msg.role === 'user'
                                                        ? 'bg-purple-600 text-white self-end'
                                                        : msg.role === 'error'
                                                        ? 'bg-red-600 text-white self-start'
                                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 self-start'
                                                }`}
                                                style={{lineHeight: 1.6}}
                                            >
                                                {msg.isHtml ? (
                                                    <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && <ThinkingAnimation />}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-2 bg-white dark:bg-black">
                                <AIAssistanceInput onSend={handleSend} isLoading={loading} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Save to Vault Modal */}
            <SaveToVault
                sessionId={currentSession?.sessionId || `doc-chat-${Date.now()}`}
                feature="document-interaction"
                onSave={handleVaultSaveSuccess}
                onCancel={handleVaultCancel}
                isVisible={showSaveToVault}
            />
        </div>
    );
};

export default DocumentChatPage;