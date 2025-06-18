import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF]">
        <h2 className="text-[32px] font-semibold mb-8 text-start text-black ml-[80px] mt-[60px]">Login</h2>
      </div>

      <div className="w-[700px] h-[700px] items-center flex items-end">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md -translate-y-[162px] transform ml-[100px]" />
      </div>
    </div>
  );
}

export default Login; 
