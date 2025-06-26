import React from 'react';

const VoiceControls = ({ isRecording, onMicClick, onStopRecording, statusText }) => (
  <div className="flex flex-col items-center gap-3 mt-4">
    <div className="flex gap-4 items-center">
      <button
        onClick={onMicClick}
        disabled={isRecording}
        className={`text-3xl p-4 rounded-full transition-colors duration-300 
          ${isRecording ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
      >
        🎤
      </button>
      
      {isRecording && (
        <button
          onClick={onStopRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 animate-pulse"
        >
          녹음 중지
        </button>
      )}
    </div>
    <div className="text-sm text-gray-600">{statusText}</div>
  </div>
);

export default VoiceControls;