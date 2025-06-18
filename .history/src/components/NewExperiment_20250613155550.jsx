import React from 'react';
import { useNavigate } from 'react-router-dom';
import newExperiment from '../assets/img/newExperiment.png';

const NewExperiment = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/experiment/create');
  };

  return (
    <div
    onClick={handleClick}
    className="h-[306px] w-[380px] border border-[#b5b5b5] rounded-[4px] shadow-sm p-5 cursor-pointer hover:shadow-md transition duration-200"
  >
    <div className="flex flex-col items-center">
      
      {/* ✅ 이미지 박스 */}
      <div className="bg-[#F1F1ED] w-[360px] h-[160px] rounded-md mb-4 flex items-center justify-center border border-[#b5b5b5] mt-[10px]">
        <img src={newExperiment} alt="새 실험 아이콘" className="w-[64px] h-[64px]" />
      </div>
  
      {/* ✅ 텍스트: 이미지와 동일한 width + 왼쪽 정렬 */}
      <div className="w-[360px] text-left">
        <h3 className="text-[#1C1C59] text-[17px] font-semibold mb-1">새 실험 생성</h3>
        <p className="text-sm text-[#444] leading-relaxed">
          새로운 실험을 등록하고, 실험실 및 사용할 장비를 설정합니다.
        </p>
      </div>
    </div>
  </div>
  );
};

export default NewExperiment;
