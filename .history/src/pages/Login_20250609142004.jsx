import React from "react";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD]">
      {/* 로그인 카드 */}
      <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[480px] flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8">Login</h2>
        <form className="w-full">
          <div className="mb-6">
            <label className="block mb-2 text-gray-700">이메일</label>
            <input
              className="border border-blue-400 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="email"
              name="email"
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 text-gray-700">비밀번호</label>
            <input
              className="border border-blue-400 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="password"
              name="password"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full shadow transition mb-4"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="text-gray-500 text-sm">
          계정이 없으신가요?{" "}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            회원가입
          </a>
        </div>
      </div>

      {/* 우측 일러스트
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src="/your-illustration.png" alt="Lab Illustration" className="max-w-md" />
      </div> */}
    </div>
  );
}

export default Login; 