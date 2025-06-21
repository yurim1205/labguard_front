// ManualAnalyzeLoading.jsx

import React from 'react';

const ManualAnalyzeLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center text-[#33308B] gap-2">
      <div className="text-[20px] font-bold">분석 중</div>
      <div className="text-[14px]">조금만 기다려주세요.</div>
      {/* 아래는 로딩 애니메이션 예시 (선택) */}
      <div className="flex gap-1 mt-2">
        <div className="w-2 h-2 rounded-full bg-[#33308B] animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-[#33308B] animate-bounce delay-200" />
        <div className="w-2 h-2 rounded-full bg-[#33308B] animate-bounce delay-400" />
      </div>
    </div>
  );
};

export default ManualAnalyzeLoading;
