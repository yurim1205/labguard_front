import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD]">
      <div className="flex w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF]">
      
      </div>
      
      <div className=" w-[400px] h-[700px] items-center ml-18">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md" />
      </div>
    </div>
  );
}

export default Login; 