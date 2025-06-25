import React from 'react';
import ExperimentEndBtn from './button/experimentEndBtn';

const InputModeToggle = ({ mode, onModeChange, onTextModeClick, onVoiceModeClick, onExperimentEndClick }) => (
  <div className="flex gap-4 justify-between items-center mt-[20px]">
    <div className="flex gap-4">
      <button
        className={`px-4 py-2 rounded-lg font-semibold border transition mr-[10px]
          ${mode === 'voice' 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
        onClick={() => {
          setMode('voice');
          if (onVoiceModeClick) {
            onVoiceModeClick();
          }
        }}
      >
        🎤 음성
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-semibold border transition 
          ${mode === 'text' 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
        onClick={() => {
          setMode('text');
          if (onTextModeClick) {
            onTextModeClick();
          }
        }}
      >
        💬 텍스트
      </button>
    </div>
    <ExperimentEndBtn onClick={onExperimentEndClick} />
  </div>
);

export default InputModeToggle;
