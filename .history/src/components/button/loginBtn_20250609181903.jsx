import React from "react";

function LoginBtn({ children = "Login", ...props }) {
  return (
    <button
      className="w-full bg-[#5989D8] hover:bg-[#4071c7] text-white font-medium py-3 rounded-full shadow-md transition text-lg"
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}

export default LoginBtn;