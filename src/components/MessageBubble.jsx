import React from 'react';

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div className={`msg-wrapper ${isUser ? 'user' : 'bot'}`}>
      <div className="msg-bubble">
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
