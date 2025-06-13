import React from 'react';
import { useNavigate } from 'react-router-dom';
import experimentContinue from '../assets/img/experimentContinue.png';

const ExperimentContinue = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/experiment/create'); 
  };

  return (
    <div
      onClick={handleClick}
      className="h-[306px] w-[360px] border border-[#b5b5b5] rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition duration-200"
    >
      <div className="bg-[#F1F1ED] h-[160px] rounded-md mb-4 flex items-center justify-center border border-[#b5b5b5]">
        <img src={experimentContinue} alt="새 실험 아이콘" className="w-[64px] h-[64px]" />
      </div>
      <h3 className="text-[#1C1C59] text-[17px] font-semibold mb-1">실험 이어하기</h3>
      <p className="text-sm text-[#444]">
       이전에 진행했던 실험을 선택해 이어서 진행할 수 있습니다.
      </p>
    </div>
  );
};

export default ExperimentContinue;