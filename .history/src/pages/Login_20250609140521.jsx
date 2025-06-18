import React from "react";

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {/* 로그인 카드 */}
      <div className="max-w-[400px] w-full my-16 p-8 bg-white rounded-3xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="w-full">
          <div className="mb-4">
            <label>아이디<br /><input className="border rounded-full px-4 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" name="username" /></label>
          </div>
          <div className="mb-6">
            <label>비밀번호<br /><input className="border rounded-full px-4 py-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" type="password" name="password" /></label>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-full transition" type="submit">Login</button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          계정이 없으신가요? <a href="#" className="text-blue-600 font-semibold hover:underline">회원가입</a>
        </div>
      </div>
      {/* 우측 일러스트 */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src="/your-illustration.png" alt="Lab Illustration" className="max-w-md" />
      </div>
    </div>
  );
}

export default Login; 