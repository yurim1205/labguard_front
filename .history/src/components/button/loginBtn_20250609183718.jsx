import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="bg-[#5989D8] hover:bg-[#4071c7] w-[300px] h-[48px] mt-[80px] ml-[105px] text-[#ffffff] font-medium py-3 rounded-full shadow-lg transition text-[32px] border-none"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}

export default LoginBtn;