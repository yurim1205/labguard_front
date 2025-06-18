import React from "react";
import SignupBtn from "../components/button/signupBtn";

function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5D93E4] to-[#E2ECFF] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF] shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]">
        <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[400px] flex flex-col items-start">
          <h2 className="text-[30px] font-extrabold mb-8 text-left justify-center items-center ml-[100px] mt-[80px]">Sign Up</h2>
          <form className="w-full flex flex-col justify-center items-center ml-[50px] space-y-8">
            <div>
              <label className="block text-[#837A7A] text-lg w-[300px] h-[30px]">사용자 이름</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
              />
            </div>

            <div>
              <label className="block text-[#837A7A] text-lg w-[300px] h-[30px]">이메일</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
              />
            </div>

            <div>
              <label className="block text-[#837A7A] text-lg w-[300px] h-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
              />
            </div>

            <div>
              <label className="block text-[#837A7A] text-lg w-[300px] h-[30px]">기업 ID</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
              />
            </div>
          </form>
          <SignupBtn>Sign Up</SignupBtn>

        </div>
      </div>
    </div>
  );
}

export default Signup; 