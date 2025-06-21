import React from 'react';

const ChatMessage = ({ message, sender }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
        isUser ? 'bg-[#E6E6FA] text-right' : 'bg-[#F2F2F2] text-left'
      }`}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;