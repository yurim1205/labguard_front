import React from "react";
import logo from "../assets/img/logo.png";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#B4D1FD]">
      <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[480px] flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8">Login</h2>
        <form className="w-full">
          <div className="mb-6">
            <label className="block mb-2 text-gray-400">이메일</label>
            <input
              className="border border-blue-400 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="email"
              name="email"
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 text-gray-400">비밀번호</label>
            <input
              className="border border-blue-400 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="password"
              name="password"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full shadow transition mt-8"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 