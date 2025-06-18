import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF]">
        <h2 className="text-[32px] font-extrabold mb-8 text-start text-black ml-[80px] mt-[60px]">Login</h2>
      
      <div className="flex flex-col w-full max-w-[600px] mx-auto">
        {/* 이메일 */}
        <div className="mb-8">
          <label className="block mb-2 text-gray-400 text-lg">이메일</label>
          <input
            className="border border-blue-400 rounded-full px-5 py-4 w-[500px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
            type="email"
            name="email"
          />
        </div>
        {/* 비밀번호 */}
        <div>
          <label className="block mb-2 text-gray-400 text-lg">비밀번호</label>
          <input
            className="border border-blue-400 rounded-full px-5 py-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
            type="password"
            name="password"
          />
        </div>
      </div>
      </div>

      <div className="w-[700px] h-[700px] items-center flex items-end">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md -translate-y-[162px] transform ml-[100px]" />
      </div>
    </div>
  );
}

export default Login; 
