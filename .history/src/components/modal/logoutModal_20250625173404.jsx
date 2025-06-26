import React from 'react';

const LogoutModal = ({ onLogout, onClose }) => {
  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 🥲")) return;

    try {
      const res = await fetch("/api/user/me", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } else {
        let errorText = await res.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // ignore JSON parse error
        }
        const errorMessage = errorData.detail || errorData.message || errorText || res.statusText;
        alert(`탈퇴에 실패했습니다 (${res.status}): ${errorMessage}`);
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다: " + err.message);
    }
  };

  return (
    // ✅ 전체 화면을 덮는 배경
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose} // ✅ 배경 클릭 시 닫기
    >
      {/* ✅ 모달 내부 클릭 시 닫힘 방지 */}
      <div
        className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onLogout}
          className="bg-[#DFE9FB] hover:bg-[#4071c7] w-[120px] h-[36px] text-[#8B8A8A] mb-[4px]
        font-medium py-3 rounded-full transition text-[14px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]"
        >
          로그아웃
        </button>
        <button
          onClick={handleWithdraw}
          className="bg-[#8DAEEC] hover:bg-[#4071c7] w-[120px] h-[36px] text-[#ffffff] 
        font-medium py-3 rounded-full transition text-[14px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
