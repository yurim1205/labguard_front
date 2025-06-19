import React from 'react';
import DotsSpinner from '../components/loadingSpinner'; // 기존 DotsSpinner 사용

const ManualAnalyzeLoading = () => (
  <div className="max-w-[520px] mx-auto justify-center items-center">
    <div className="text-[#33308B] text-[26px] text-center mb-[10px] mt-[200px] font-[500]">
      분 석 중
    </div>
    <div className="text-[#33308B] text-[16px] mb-[44px] text-center  font-[400]">
      조금만 기다려주세요.
    </div>
    <DotsSpinner />
  </div>
);

export default ManualAnalyzeLoading;