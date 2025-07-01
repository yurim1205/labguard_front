import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExperimentSaveBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ExperimentContinue');  // 원하는 경로로 이동
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
        shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none
        bg-[#565991] hover:bg-[#4071c7] text-[#ffffff]"
    >
      실험 저장
    </button>
  );
};

export default ExperimentSaveBtn;
