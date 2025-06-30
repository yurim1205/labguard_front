import React from 'react';
import experimentContinue from '../assets/img/experimentContinue.png';

const NewExperiment = ({ onClick }) => {
  return (
    <div
  onClick={onClick}
  className="w-[360px] h-[320px] bg-white rounded-[5px] p-10 
             shadow-[0_12px_24px_0_rgba(54,101,255,0.3)]
             hover:shadow-[0_12px_24px_0_rgba(54,101,255,0.4)]
             hover:-translate-y-3 hover:scale-105 
             transition ease-in-out duration-300 transform cursor-pointer"
>
  <div className="flex flex-col items-center justify-between h-full">
    <div
      className="bg-[#FFFFFF] rounded-[5px] flex items-center justify-center"
      style={{ width: "320px", height: "160px" }}
    >
      <img src={experimentContinue} alt="실험 이어하기 아이콘" className="w-[96px] h-[96px] mt-[42px] object-contain" />
    </div>
    <div className="text-center mt-4">
      <h3 className="text-xl font-bold mb-2 text-[#33308B]">실험 이어하기</h3>
      <p className="text-gray-600 text-base">이전에 진행하던 실험을 선택해 이어서 진행할 수 있습니다.</p>
    </div>
  </div>
</div>

  );
};

export default NewExperiment;