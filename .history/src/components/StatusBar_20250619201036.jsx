import React from 'react';

const StatusBar = ({ message, type }) => {
  const baseStyle = 'w-full text-center py-2 rounded-md font-medium mt-4';
  const typeStyle = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  };

  return (
    <div className={`${baseStyle} ${typeStyle[type] || ''}`}>
      {message}
    </div>
  );
};

export default StatusBar;
