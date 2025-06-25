import React from 'react';

const LogoutModal = ({ onLogout }) => {
  const handleWithdraw = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 🥲\n\n현재 데이터베이스 스키마 문제로 탈퇴 기능에 오류가 있을 수 있습니다.")) return;

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
          
          // JSON인지 확인 후 파싱 시도
          if (responseText && responseText.trim().startsWith('{')) {
            try {
              errorData = JSON.parse(responseText);
            } catch (jsonError) {
              console.error("JSON parse error:", jsonError);
            }
          }
        } catch (parseError) {
          console.error("Failed to get response text:", parseError);
        }
        
        console.error("Error details:", errorData);
        
        // HTML 응답인 경우 간단한 메시지로 변경
        let errorMessage = errorData.detail || errorData.message;
        
        if (!errorMessage) {
          if (errorText && errorText.includes('Internal Server Error')) {
            errorMessage = '서버 내부 오류가 발생했습니다. 서버 로그를 확인해주세요.';
          } else {
            errorMessage = errorText || res.statusText;
          }
        }
        
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