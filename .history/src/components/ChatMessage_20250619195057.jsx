import React from 'react';

const ChatMessage = ({ sender, text }) => {
  const className = sender === 'user' ? 'user-message' : 'bot-message';
  const label = sender === 'user' ? '사용자' : 'AI 챗봇';

  return (
    <div className={`message ${className}`}>
      <strong>{label}:</strong> {text}
    </div>
  );
};