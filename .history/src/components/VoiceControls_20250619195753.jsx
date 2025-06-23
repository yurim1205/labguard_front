import React from 'react';

const VoiceControls = ({ isRecording, onMicClick, statusText }) => (
  <div className="voice-controls">
    <button
      className={`mic-button ${isRecording ? 'recording' : ''}`}
      onClick={onMicClick}
    >
      🎤
    </button>
    <div className="voice-status">{statusText}</div>
  </div>
);

export default VoiceControls;