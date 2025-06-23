import React from 'react';

const LogoutModal = ({ onLogout }) => {
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
        console.error(`HTTP ${res.status}: ${res.statusText}`);
        
        // JSON과 텍스트 응답 모두 시도
        let errorData = {};
        let errorText = '';
        
        try {
          const responseText = await res.text();
          console.error("Response text:", responseText);
          errorText = responseText;
          
          if (responseText) {
            errorData = JSON.parse(responseText);
          }
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
        }
        
        console.error("Error details:", errorData);
        
        const errorMessage = errorData.detail || errorData.message || errorText || res.statusText;
        alert(`탈퇴에 실패했습니다 (${res.status}): ${errorMessage}`);
      }
    } catch (err) {
      console.error("탈퇴 요청 실패:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        alert("서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
      } else {
        alert("서버 오류가 발생했습니다: " + err.message);
      }
    }
  };

  return (
    <div className="w-[150px] h-[120px] bg-[#FFFFFF] mt-[10px] rounded-[30px] p-8 flex flex-col items-center justify-between shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]">
    <div className="w-[150px] h-[120px] rounded-lg bg-gray-100 flex flex-col justify-center items-center shadow-md">
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