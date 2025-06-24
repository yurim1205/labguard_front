import React from 'react';

const logoutModal = () => {
  return (
    <div className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md">
        <button
            onClick={handleLogout}
            className="text-[#1A237E] text-sm font-bold border border-[#1A237E] px-4 py-1 rounded-full hover:bg-[#1A237E] hover:text-white transition flex items-center gap-2"
          >
            로그아웃
          </button>
      <button className="m-1 p-2 rounded bg-blue-300 hover:bg-blue-400">탈퇴하기</button>
    </div>
  );
};

export default logoutModal; 