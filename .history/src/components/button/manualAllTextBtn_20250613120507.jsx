import React from 'react';

const ManualAllTextBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 border border-gray-100 rounded-[10px] bg-white text-[#1C1C59]
       font-bold text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:bg-gray-100
        transition duration-200 cursor-pointer"
    >
      매뉴얼 전체 보기
    </button>
  );
};

export default ManualAllTextBtn;