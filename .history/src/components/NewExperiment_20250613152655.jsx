import React from 'react';
import labIcon from '../assets/img/lab-icon.png'; // 아이콘 경로에 맞게 수정

const NewExperiment = () => {
  return (
    <div className="w-full border border-[#b5b5b5] rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition duration-200">
      <div className="flex flex-col items-center text-center">
        {/* 상단 이미지 영역 */}
        <div className="bg-[#F1F1ED] h-[160px] w-full rounded-md mb-4 flex items-center justify-center border border-[#b5b5b5]">
          <img src={labIcon} alt="새 실험 아이콘" className="w-[64px] h-[64px]" />
        </div>

        {/* 텍스트 영역 */}
        <h3 className="text-[#1C1C59] text-[17px] font-semibold mb-1">새 실험 생성</h3>
        <p className="text-sm text-[#444]">
          새로운 실험을 등록하고, 실험실 및 사용할 장비를 설정합니다.
        </p>
      </div>
    </div>
  );
};

export default NewExperiment;
