import React from 'react';

const LogoutModal = ({ onLogout }) => {
  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 🥲")) return;

    try {
      const res = await fetch("http://localhost:8000/api/user/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } else {
        alert("탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md">
      <button
        onClick={onLogout}
        className="m-1 p-2 rounded bg-gray-300 hover:bg-gray-400"
      >
        로그아웃
      </button>
      <button 
        onClick={handleWithdraw}
        className="m-1 p-2 rounded bg-blue-300 hover:bg-blue-400"
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default LogoutModal;
