import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="bg-[#5989D8] hover:bg-[#4071c7] w-[300px] h-[36px] mt-[28px] ml-[105px] mb-[40px] text-white font-medium py-3 rounded-full shadow-md transition text-lg border-none"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}

export default LoginBtn;