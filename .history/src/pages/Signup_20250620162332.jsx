import React, { useState } from "react";
import SignupBtn from "../components/button/signupBtn";

function Signup() {
  const [form, setForm] = useState({
    name: '',
    password: '',
    company_id: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),  // form은 { name, password, company_id } 등
      });
  
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "회원가입 실패");
      }
  
      alert("회원가입 성공!");
      // 예: navigate("/login") 또는 토큰 저장 등
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5D93E4] to-[#E2ECFF] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF] shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]">
        <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[400px] flex flex-col items-start">
          <h2 className="text-[30px] font-extrabold mb-8 text-left justify-center items-center ml-[100px] mt-[80px]">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="items-center w-full flex flex-col justify-center ml-[50px] space-y-[12px]">
            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">사용자 이름</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">기업 ID</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="text"
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 ml-[20px]">
              <SignupBtn>Sign Up</SignupBtn>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Signup;
