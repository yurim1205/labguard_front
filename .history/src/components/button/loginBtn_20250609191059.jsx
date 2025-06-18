import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="bg-[#5989D8] hover:bg-[#4071c7] w-[300px] h-[48px] mt-[80px] ml-[105px] text-[#ffffff] 
      font-medium py-3 rounded-full transition text-[16px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.5)]"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}

export default LoginBtn;