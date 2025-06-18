import React from 'react';
import newExperiment from '../assets/img/newExperiment.png';

const NewExperiment = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="h-[306px] w-[400px] border border-[#b5b5b5] rounded-[4px] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] p-5 cursor-pointer hover:shadow-md transition duration-200"
    >
      <div className="flex flex-col items-center">
        <div className="bg-[#F1F1ED] w-[360px] h-[160px] rounded-md mb-4 flex items-center justify-center border border-[#b5b5b5] mt-[10px]">
          <img src={newExperiment} alt="새 실험 아이콘" className="w-[96px] h-[96px]" />
        </div>

        <div className="w-[360px] text-left">
          <h3 className="text-[#1C1C59] text-[17px] font-semibold mb-1">새 실험 생성</h3>
          <p className="text-sm text-[#444] leading-relaxed">
            새로운 실험을 등록할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewExperiment;
