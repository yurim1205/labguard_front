import React from "react";

const DeleteAccountButton = ({ onDelete }) => {
  const handleClick = () => {
    if (window.confirm("정말로 탈퇴하시겠습니까? 🥲")) {
      onDelete(); // 상위에서 API 호출 로직 주입
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      탈퇴하기
    </button>
  );
};

export default DeleteAccountButton;