import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD]">
      {/* 로그인 카드 */}
      <div className="flex w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF]">
      
      </div>
      
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md" />
      </div>
    </div>
  );
}

export default Login; 