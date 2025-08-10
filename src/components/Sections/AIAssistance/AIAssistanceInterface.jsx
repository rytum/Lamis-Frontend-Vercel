import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatInput from './AIAssistanceInput';
import { chartDashboard } from './chartDashboard';
import { hardcodedGraphData } from './hardcodedGraphData';

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
                <span className="text-sm text-gray-600">Thinking...</span>
            </div>
        </div>
    );
};

const ChatInterface = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSessions(response.data);
      if (response.data.length > 0 && !currentSession) {
        setCurrentSession(response.data[0]);
        fetchMessages(response.data[0].session_id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await axios.get(`/api/chat/history/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const startNewSession = async () => {
    try {
      const response = await axios.post('/api/chat/session', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSessions([response.data, ...sessions]);
      setCurrentSession(response.data);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const sendMessage = async (message, files = []) => {
    if ((!message.trim() && files.length === 0) || !currentSession) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('sessionId', currentSession.session_id);
      formData.append('message', message);
      
      // Append files to FormData
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await axios.post('/api/chat/message', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('AI Response:', response.data.aiResponse);
      setMessages([...messages, response.data.userMessage, response.data.assistantMessage]);

      // Handle graph data for chartDashboard
      if (response.data.aiResponse && response.data.aiResponse.graphs) {
        setGraphData(response.data.aiResponse.graphs);
      } else {
        setGraphData(hardcodedGraphData);
      }
      setShowChart(false); // Reset chart display after each message

      // Update session if title changed
      if (response.data.session) {
        setSessions(sessions.map(s => 
          s.session_id === response.data.session.session_id ? response.data.session : s
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = (recording) => {
    setIsRecording(recording);
    setRecordingError('');
    
    if (recording) {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        setRecordingError('Voice recording is not supported in this browser. Please use Chrome, Edge, or Safari.');
        setIsRecording(false);
        return;
      }
      
      // Voice recording started silently
    } else {
      // Voice recording stopped silently
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <button
            onClick={startNewSession}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            New Chat
          </button>
        </div>
        <div className="overflow-y-auto">
          {sessions.map(session => (
            <div
              key={session.session_id}
              onClick={() => {
                setCurrentSession(session);
                fetchMessages(session.session_id);
              }}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                currentSession?.session_id === session.session_id ? 'bg-gray-100' : ''
              }`}
            >
              <h3 className="font-medium truncate">{session.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-4 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {loading && <ThinkingAnimation />}
          <div ref={messagesEndRef} />
        </div>

        {/* Chart Dashboard Toggle Button and Display (moved outside scroll area) */}
      </div> {/* End of chat message scroll area */}

      {/* Chart Dashboard Toggle Button and Display */}
      {graphData && messages.some(m => m.sender === 'assistant') && (
        <div className="p-4 bg-white border-t">
          <button
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => setShowChart((prev) => !prev)}
          > show 
            {showChart ? 'Hide Chart Dashboard' : 'Show Chart Dashboard'}
          </button>
          {showChart && chartDashboard({ graphData })}
        </div>
      )}

        {/* Recording Error Message */}
        {recordingError && (
          <div className="px-4 py-2 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="text-sm">{recordingError}</p>
          </div>
        )}

        {/* Enhanced Input with file upload and mic */}
        <div className="p-4 border-t bg-white">
          <ChatInput 
            onSend={sendMessage}
            onMicToggle={handleMicToggle}
            isLoading={loading}
          />
        </div>
      </div>
  );
};

export default ChatInterface;
