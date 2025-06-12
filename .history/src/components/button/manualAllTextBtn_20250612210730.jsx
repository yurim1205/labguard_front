import React from 'react';

const ManualAllTextBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 border border-gray-300 rounded-md bg-white text-[#1C1C59] font-bold text-[16px] shadow-sm hover:bg-gray-100 transition duration-200"
    >
      매뉴얼 전체 보기
    </button>
  );
};

export default ManualAllTextBtn;
