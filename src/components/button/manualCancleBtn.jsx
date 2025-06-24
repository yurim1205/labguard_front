import React from 'react';

const ManualCancleBtn = ({ onClick }) => {
const ManualCancleBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-[24px] py-[7px] mt-[10px] border border-red-300 rounded-[10px] bg-white text-red-600
       font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-red-50 hover:border-red-400
        transition duration-200 cursor-pointer"
    >
      매뉴얼 삭제
    </button>
  );
};

export default ManualCancleBtn;  