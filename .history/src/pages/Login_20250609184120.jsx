import React from "react";
import logo from "../assets/img/logo.png";
import LoginBtn from "../components/button/loginBtn";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF]">
        <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[400px] flex flex-col items-start">
          <h2 className="text-[30px] font-extrabold mb-8 text-left justify-center items-center ml-[100px] mt-[80px]">Login</h2>
          <form className="w-full flex flex-col gap-6 justify-center items-center ml-[50px]">
            <div>
              <label className="block text-[#837A7A] text-lg w-[300px] h-[30px] mt-[28px]">이메일</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#837A7A] text-lg w-[300px]  h-[30px] mt-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
              />
            </div>
          </form>
          <LoginBtn>Login</LoginBtn>
          <div className="flex flex-col items-center">
  <LoginBtn />
  <div className="mt-6 text-lg font-bold text-gray-400 flex items-center">
    계정이 없으신가요?&nbsp;
    <a href="/signup" className="text-blue-700 font-bold hover:underline">회원가입</a>
    &nbsp;하기
  </div>
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