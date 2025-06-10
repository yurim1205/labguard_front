import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#B4D1FD]">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md bg-white"></div>
      <div className="w-[400px] h-[700px] flex items-center ml-8">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md" />
      </div>
    </div>
  );
}

export default Login; 