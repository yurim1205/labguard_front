import React from 'react';

const logoutModal = () => {
  return (
    <div className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md">
      <button className="m-1 p-2 rounded bg-gray-300 hover:bg-gray-400">로그아웃</button>
      <button className="m-1 p-2 rounded bg-blue-300 hover:bg-blue-400">탈퇴하기</button>
    </div>
  );
};

export default logoutModal; 