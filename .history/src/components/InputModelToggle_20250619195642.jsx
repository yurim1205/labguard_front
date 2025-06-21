import React from 'react';

const InputModeToggle = ({ mode, setMode }) => (
  <div className="mode-selector">
    <button
      className={`mode-button ${mode === 'voice' ? 'active' : ''}`}
      onClick={() => setMode('voice')}
    >
      🎤 음성
    </button>
    <button
      className={`mode-button ${mode === 'text' ? 'active' : ''}`}
      onClick={() => setMode('text')}
    >
      💬 텍스트
    </button>
  </div>
);

export default InputModeToggle;