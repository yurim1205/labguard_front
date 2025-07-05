import React from 'react';
import ExperimentEndBtn from './button/experimentEndBtn';
import ExperimentSaveBtn from './button/experimentSaveBtn';

const InputModeToggle = ({ mode, onModeChange, onTextModeClick, onVoiceModeClick, onExperimentEndClick, onExperimentSaveClick }) => (
  <div className="flex gap-4 justify-between items-center mt-[20px]">
    <div className="flex gap-[10px]">
      <button
        className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
          shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none
          ${mode === 'voice' 
            ? 'bg-[#99B5CE] text-[#ffffff] hover:bg-[#4071c7]' 
            : 'bg-[#99B5CE] text-[#ffffff] hover:bg-[#4071c7]'}`}
        onClick={() => {
          onModeChange('voice');
          if (onVoiceModeClick) {
            onVoiceModeClick();
          }
        }}
      >
        🎤 음성 질문
      </button>
      <button
        className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
          shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none 
          ${mode === 'voice' 
            ? 'bg-[#99B5CE] text-[#ffffff] hover:bg-[#4071c7]' 
            : 'bg-[#99B5CE] text-[#ffffff] hover:bg-[#4071c7]'}`}
        onClick={() => {
          onModeChange('text');
          if (onTextModeClick) {
            onTextModeClick();
          }
        }}
      >
        💬 채팅하기
      </button>
    </div>
    <div className="flex gap-[10px]">
      <ExperimentSaveBtn onClick={onExperimentSaveClick} />
      <ExperimentEndBtn onClick={onExperimentEndClick} />
    </div>
  </div>
);

export default InputModeToggle;