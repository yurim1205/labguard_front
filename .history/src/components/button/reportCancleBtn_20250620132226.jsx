import React from 'react';

const ReportCancleBtn = ({ onClick = () => {} }) => (
  <button
    onClick={onClick}
    className="mt-[12px] bg-[#33308B] text-[#FFFFFF] text-[16px] font-semibold
     px-8 py-3 rounded-[8px] outline-none border-none shadow-sm hover:bg-[#2a276f] transition duration-200"
  >
   리포트 삭제
  </button>
);

export default ReportCancleBtn;