import React from 'react';

const LogoutModal = ({ onLogout, onWithdraw }) => {
  return (
    <div className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md">
        <button
            onClick={onLogout}
            className="m-1 p-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            로그아웃
          </button>
      <button 
        className="m-1 p-2 rounded bg-blue-300 hover:bg-blue-400"
        onClick={onWithdraw}
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default LogoutModal; 