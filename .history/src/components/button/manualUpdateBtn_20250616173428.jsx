import React from 'react';

const ManualUpdateBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-[24px] py-[7px] border border-gray-300 rounded-[10px] bg-[#FFFFFF] text-[#1C1C59]
        font-[700] text-[16px] shadow hover:bg-gray-100 transition duration-200"
    >
      매뉴얼 등록
    </button>
  );
};

export default ManualUpdateBtn;
