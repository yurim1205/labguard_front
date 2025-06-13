import React from 'react';

const ManualAllTextBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-[10px] py-[7px] border border-gray-100 rounded-[10px] bg-white text-[#1C1C59]
       font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100
        transition duration-200 cursor-pointer"
    >
      매뉴얼 전체 보기
    </button>
  );
};

export default ManualAllTextBtn;