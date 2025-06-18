import React from 'react';

const AnalyzeBtn = ({ onClick = () => {} }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#33308B] text-[#FFFFFF] text-[20px] font-semibold px-8 py-3 rounded-lg hover:bg-[#2a276f] transition duration-200"
    >
      분석 시작
    </button>
  );
};

export default AnalyzeBtn;