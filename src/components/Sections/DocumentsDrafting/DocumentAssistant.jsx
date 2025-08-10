import React, { useState } from 'react';
import { Send } from 'lucide-react';
import StreamingText from '../AIAssistance/StreamingText';

// Sub-component for the text input field
function ChatInputField({ value, onChange, onKeyDown, disabled }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Ask for help with your document..."
      className="w-full bg-white dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 rounded-lg px-3 lg:px-4 py-2 lg:py-3 pr-20 lg:pr-24 border border-gray-300 dark:border-black focus:border-purple-500 focus:ring-2 focus:ring-purple-700/30 transition outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
      disabled={disabled}
      autoComplete="off"
    />
  );
}

// Sub-component for the action buttons
function ChatInputActions({ onSend, disabled }) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:pr-3 gap-1">
      <button 
        className="p-1.5 lg:p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition shadow text-white disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onSend} 
        disabled={disabled}>
        <Send size={16} className="lg:w-[18px] lg:h-[18px]" />
      </button>
    </div>
  );
}

const DocumentAssistant = ({ onUpdateContent }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handler to send the message
  const handleSend = async () => {
    if (value.trim() === "" || isLoading) return;

    const userMessage = value.trim();
    setValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to use the AI assistant');
        return;
      }

      const response = await fetch('/api/documents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Update messages with both user message and AI response
      setMessages(prev => [
        ...prev,
        { sender: 'user', message: userMessage },
        { sender: 'assistant', message: data.content }
      ]);

      // If there's content to be inserted into the document
      if (data.documentContent) {
        onUpdateContent?.(data.documentContent);
      }
    } catch (error) {
      console.error('Chat error:', error);
      alert('Failed to get AI response: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] lg:max-w-[80%] p-2.5 lg:p-3 rounded-lg text-sm lg:text-base ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {msg.sender === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.message}</div>
              ) : (
                                 <StreamingText 
                   text={msg.message} 
                   speed={20}
                 />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <ChatInputField
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <ChatInputActions
            onSend={handleSend}
            disabled={isLoading || value.trim() === ""}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentAssistant;
