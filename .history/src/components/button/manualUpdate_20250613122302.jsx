import React from 'react';

const ManualUpdateBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-[16px] py-[7px] mt-[10px] border border-gray-[10px] rounded-[10px] bg-white text-[#1C1C59]
       font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100
        transition duration-200 cursor-pointer"
    >
      매뉴얼 등록
    </button>
  );
};

export default ManualUpdateBtn;