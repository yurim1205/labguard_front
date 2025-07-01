import React from 'react';

const ExperimentEndBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
        shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none
        bg-[#565991] hover:bg-[#4071c7] text-[#ffffff]"
    >
      실험 종료
    </button>
  );
};

export default ExperimentEndBtn;
