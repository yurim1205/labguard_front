import React from 'react';

const VoiceControls = ({ isRecording, onMicClick, onStopRecording, statusText }) => (
  <div className="flex flex-col items-center gap-3 mt-4">
    <div className="flex flex-row gap-4 items-center justify-center">
      <button
        onClick={onMicClick}
        disabled={isRecording}
        className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
          shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none flex-shrink-0
          ${isRecording ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#565991] hover:bg-[#4071c7] text-[#ffffff]'}`}
      >
        🎤 녹음
      </button>
      
      <button
        onClick={onStopRecording}
        disabled={!isRecording}
        className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
          shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none flex-shrink-0
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        🛑 중지
      </button>
    </div>
    {statusText && <div className="text-sm text-gray-600">{statusText}</div>}
  </div>
);

export default VoiceControls;