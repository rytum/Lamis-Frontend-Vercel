import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Mic, MicOff, Paperclip, X, Plus } from 'lucide-react';

// Sub-component for the text input field
function ChatInputField({ value, onChange, onKeyDown, disabled, onFileUpload, fileInputRef, hasFiles, isLoading, aiResponding }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    
    // Filter out files that are too large
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum file size is 5 MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0 && onFileUpload) {
      onFileUpload(validFiles);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className={`relative w-full transition-all duration-500 ease-in-out ${
      isLoading || aiResponding ? 'scale-95 opacity-85' : 'scale-100 opacity-100'
    }`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={isLoading ? "Thinking..." : (hasFiles ? "Type your message or press Enter to send with files..." : "Ask your legal question")}
        className={`w-full bg-gray-200 dark:bg-[#121212] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 rounded-2xl sm:rounded-3xl px-3 sm:px-4 pr-24 sm:pr-28 md:pr-32 border-2 transition-all duration-500 ease-in-out outline-none disabled:opacity-50 disabled:cursor-not-allowed focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium sm:font-semibold text-sm sm:text-base ${
          isLoading || aiResponding
            ? 'py-1.5 sm:py-2 md:py-2.5 lg:py-3 border-gray-300 dark:border-gray-600 shadow-sm bg-gray-150 dark:bg-[#1a1a1a]' 
            : 'py-2 sm:py-3 md:py-4 lg:py-5 border-gray-400 dark:border-gray-500 shadow-md'
        }`}
        disabled={disabled}
        autoComplete="off"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
    </div>
  );
}

// Sub-component for the action buttons inside the input field
function ChatInputActions({ onSend, onFileUpload, onMicToggle, isRecording, disabled, fileInputRef, hasContent, isLoading, aiResponding }) {
  return (
    <div className={`absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 gap-2 transition-all duration-500 ease-in-out ${
      isLoading || aiResponding ? 'scale-95 opacity-85' : 'scale-100 opacity-100'
    }`}>
      {/* File Upload Button */}
      <button 
        className="p-1 sm:p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        title="Upload files (PDF, DOC, DOCX, TXT, JPG, PNG) - Max 5 MB per file"
      >
        <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
      </button>

      {/* Microphone Button */}
      <button 
        className={`p-1 sm:p-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
        onClick={onMicToggle}
        disabled={disabled}
        title={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? <MicOff size={12} className="sm:w-3.5 sm:h-3.5" /> : <Mic size={12} className="sm:w-3.5 sm:h-3.5" />}
      </button>

      {/* Send button */}
      <button 
        className={`p-1 sm:p-1.5 rounded-full transition shadow disabled:opacity-50 disabled:cursor-not-allowed ${
          isLoading || aiResponding
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' 
            : hasContent
              ? 'bg-gray-100 dark:bg-gray-800 hover:bg-purple-500 hover:text-white text-gray-600 dark:text-gray-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
        }`} 
        onClick={onSend} 
        disabled={disabled || !hasContent}
        title="Send message"
      >
        <Send size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

// File preview component
function FilePreview({ files, onRemoveFile }) {
  if (!files || files.length === 0) return null;

  const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 mb-1">
      <div className="w-full text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
        📎 Selected files ({files.length}) - Max 5 MB per file:
      </div>
      {files.map((file, index) => {
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        const isLargeFile = file.size > maxSize * 0.8; // Warning if > 4 MB
        
        return (
          <div key={index} className={`flex items-center gap-1 sm:gap-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 border shadow-sm ${
            isLargeFile 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' 
              : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}>
            <Paperclip size={10} className={`sm:w-3 sm:h-3 ${isLargeFile ? "text-yellow-500" : "text-gray-500"}`} />
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-16 sm:max-w-28 font-medium">
              {file.name}
            </span>
            <span className={`text-xs ${isLargeFile ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
              ({fileSizeMB} MB)
            </span>
            {isLargeFile && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ Large
              </span>
            )}
            <button
              onClick={() => onRemoveFile(index)}
              className="text-gray-400 hover:text-red-500 transition p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Remove file"
            >
              <X size={8} className="sm:w-2.5 sm:h-2.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Voice recording component
function VoiceRecorder({ isRecording, onTranscript }) {
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        // console.log('Voice recognition started');
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        // console.error('Speech recognition error:', event.error);
      };

      recognitionInstance.onend = () => {
        // console.log('Voice recognition ended');
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      // console.warn('Speech recognition not supported in this browser');
    }
  }, [onTranscript]);

  useEffect(() => {
    if (!recognition || !isSupported) return;

    if (isRecording) {
      try {
        if (recognition) {
          recognition.start();
          // Voice recognition started silently
        }
      } catch (error) {
        // console.error('Error starting speech recognition:', error);
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        // console.error('Error stopping speech recognition:', error);
      }
    }
  }, [isRecording, recognition, isSupported]);

  if (!isSupported) {
    return null;
  }

  return null; // This component doesn't render anything visible
}

// Main ChatInput component
const ChatInput = ({ onSend, onFileUpload, onMicToggle, isLoading = false, aiResponding = false }) => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handler to send the message
  const handleSend = () => {
    if (value.trim() !== "" || files.length > 0) {
      if (onSend) onSend(value, files);
      setValue("");
      setFiles([]);
      setUploadSuccess(false);
    }
  };

  // Handler for file upload
  const handleFileUpload = (uploadedFiles) => {
    setFiles(prev => [...prev, ...uploadedFiles]);
    setUploadSuccess(true);
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  // Handler to remove a file
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handler for voice transcript
  const handleTranscript = (transcript) => {
    setValue(prev => prev + (prev ? ' ' : '') + transcript);
  };

  // Handler for microphone toggle
  const handleMicToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (onMicToggle) onMicToggle(false);
    } else {
      // Start recording
      setIsRecording(true);
      if (onMicToggle) onMicToggle(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Voice Recorder Component */}
      <VoiceRecorder isRecording={isRecording} onTranscript={handleTranscript} />
      
      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-2 py-1 mb-1">
          ✅ Files uploaded successfully! You can now send your message.
        </div>
      )}
      
      {/* File Preview */}
      <FilePreview files={files} onRemoveFile={handleRemoveFile} />
      
      {/* The main container for the input field and actions */}
      <div className={`relative rounded-lg sm:rounded-xl flex overflow-hidden transition-all duration-500 ease-in-out ${
        isLoading || aiResponding
          ? 'scale-98 opacity-95' 
          : 'scale-100 opacity-100'
      }`}>
        <ChatInputField 
          value={value} 
          onChange={e => setValue(e.target.value)} 
          onKeyDown={e => { if (e.key === 'Enter' && !isLoading) handleSend(); }}
          disabled={isLoading}
          onFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          hasFiles={files.length > 0}
          isLoading={isLoading}
          aiResponding={aiResponding}
        />
        <ChatInputActions 
          onSend={handleSend} 
          onFileUpload={handleFileUpload}
          onMicToggle={handleMicToggle}
          isRecording={isRecording}
          disabled={isLoading} 
          fileInputRef={fileInputRef}
          hasContent={value.trim() !== "" || files.length > 0}
          isLoading={isLoading}
          aiResponding={aiResponding}
        />
      </div>
    </div>
  );
};

export default ChatInput;
