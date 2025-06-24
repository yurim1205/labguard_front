import React from 'react';

const InputModeToggle = ({ mode, setMode, onTextModeClick }) => (
  <div className="flex gap-4 justify-left mt-[20px]">
    <button
      className={`px-4 py-2 rounded-lg font-semibold border transition mr-[10px]
        ${mode === 'voice' 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
      onClick={() => setMode('voice')}
    >
      🎤 음성
    </button>
    <button
      className={`px-4 py-2 rounded-lg font-semibold border transition 
        ${mode === 'text' 
          ? 'bg-blue-600 text-white border-blue-600' 
          : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
      onClick={() => setMode('text')}
    >
      💬 텍스트
    </button>
  </div>
);

export default InputModeToggle;
