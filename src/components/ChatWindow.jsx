import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endOfMessagesRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // 'hi-IN' supports both English and Hindi heavily mixed by Indian users
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition", e);
      }
    }
  };

  // Load initial welcome message on mount
  useEffect(() => {
    setMessages([
      { id: Date.now(), text: "Hi! I am your AI Study Assistant. Ask me any question in English or Hindi!", sender: 'bot' }
    ]);
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Backend or API Key error');
      }

      const data = await response.json();
      const botMsg = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.warn("Chat API failed, using fallback mock response:", error);
      
      // Fallback response if backend is not running or API key is missing
      setTimeout(() => {
        const isHindi = /[अ-ह]/.test(currentInput) || currentInput.toLowerCase().includes('hai') || currentInput.toLowerCase().includes('kya');
        
        let mockReply = "I am a helpful study assistant. How can I assist you with your studies today?";
        if (isHindi) {
          mockReply = "मैं एक स्मार्ट स्टडी असिस्टेंट हूँ। आज मैं आपकी पढ़ाई में कैसे मदद कर सकता हूँ?";
        }
        
        if (currentInput.toLowerCase().includes('exam') || currentInput.toLowerCase().includes('quiz')) {
          mockReply = isHindi ? "आप डैशबोर्ड से क्विज़ या परीक्षा शुरू कर सकते हैं।" : "You can start a quiz or an exam directly from your dashboard!";
        }

        const botMsg = { id: Date.now() + 1, text: mockReply, sender: 'bot' };
        setMessages((prev) => [...prev, botMsg]);
      }, 1000);
    } finally {
      // Small timeout to let the UI feel natural
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-icon">🤖</div>
          <span>Study Assistant AI</span>
        </div>
        <button className="chat-close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form className="chat-footer" onSubmit={handleSend}>
        <button 
          type="button" 
          className="chat-send-btn" 
          onClick={toggleListen}
          title={isListening ? "Stop listening" : "Start Voice Input"}
          style={{ background: isListening ? '#ef4444' : '#f1f5f9', color: isListening ? 'white' : '#64748b' }}
        >
          {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!input.trim() || isTyping}
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
