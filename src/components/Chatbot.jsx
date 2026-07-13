import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { FiMessageSquare } from 'react-icons/fi';
import '../styles/chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      
      <button 
        className="chatbot-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chatbot"
      >
        <FiMessageSquare />
      </button>
    </div>
  );
}

export default Chatbot;
