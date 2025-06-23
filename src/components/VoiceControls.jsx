import React from 'react';

const VoiceControls = ({ isRecording, onMicClick, statusText }) => (
  <div className="flex flex-col items-center gap-3 mt-4">
    <button
      onClick={onMicClick}
      className={`text-3xl p-4 rounded-full transition-colors duration-300 
        ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
    >
      🎤
    </button>
    <div className="text-sm text-gray-600">{statusText}</div>
  </div>
);

export default VoiceControls;