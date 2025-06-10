import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="bg-[#5989D8] hover:bg-[#4071c7] w-[300px] h-[30px] mt-[28px]  ml-[50px] text-white font-medium py-3 rounded-full shadow-md transition text-lg"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}

export default LoginBtn;