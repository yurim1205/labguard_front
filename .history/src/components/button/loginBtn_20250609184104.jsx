import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="bg-[#5989D8] hover:bg-[#4071c7] w-[300px] h-[48px] mt-[80px] ml-[105px] text-[#ffffff] font-medium py-3 rounded-full shadow-lg transition text-[20px] border-none"
      type="submit"
      {...props}
    >
        <div className="flex flex-col items-center">
  <LoginBtn />
  <div className="mt-6 text-lg font-bold text-gray-400 flex items-center">
    계정이 없으신가요?&nbsp;
    <a href="/signup" className="text-blue-700 font-bold hover:underline">회원가입</a>
    &nbsp;하기
  </div>
</div>
      {children}
    </button>
  );
}

export default LoginBtn;