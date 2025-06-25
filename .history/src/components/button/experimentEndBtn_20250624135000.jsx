import React from 'react';

const ExperimentEndBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
       className="bg-[#565991] hover:bg-[#4071c7] w-[80px] h-[32px]  text-[#ffffff] 
      font-medium py-3 rounded-[5px] transition text-[16px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]"
    >
      실험 종료
    </button>
  );
};

export default ExperimentEndBtn;      