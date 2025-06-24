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
    <div className="w-[150px] h-[170px] bg-[#FFFFFF] rounded-[30px] p-8 flex flex-col items-center justify-between shadow-xl">
  
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