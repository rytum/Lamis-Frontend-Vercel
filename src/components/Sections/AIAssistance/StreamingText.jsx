import React, { useState, useEffect, useRef } from 'react';

const StreamingText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  // Function to convert markdown to HTML
  const convertMarkdownToHtml = (text) => {
    if (!text) return '';
    
    const converted = text
      // Convert bold text (**text** or __text__) - handle nested cases
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Convert italic text (*text* or _text_) - handle nested cases
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Convert headers (# Header)
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Convert line breaks
      .replace(/\n/g, '<br />')
      // Remove thinking process indicators
      .replace(/<think>.*?<\/think>/g, '')
      .replace(/## <think>.*?<\/think>/g, '')
      .replace(/<think>.*?<\/think>/g, '');
    
    return converted;
  };

  useEffect(() => {
    if (!text || text.length === 0) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
      return;
    }

    // Reset state when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // If speed is 0, display text instantly
    if (speed === 0) {
      const htmlText = convertMarkdownToHtml(text);
      setDisplayedText(htmlText);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    // Start streaming effect
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex >= text.length) {
          clearInterval(intervalRef.current);
          setIsComplete(true);
          if (onComplete) onComplete();
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, onComplete]);

  useEffect(() => {
    const currentText = text.slice(0, currentIndex);
    const htmlText = convertMarkdownToHtml(currentText);
    setDisplayedText(htmlText);
  }, [currentIndex, text]);

  return (
    <span 
      className="whitespace-pre-wrap inline-block"
      dangerouslySetInnerHTML={{ __html: displayedText }}
    >
    </span>
  );
};

export default StreamingText; 