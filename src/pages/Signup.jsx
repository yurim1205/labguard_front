import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import SignupBtn from "../components/button/signupBtn";

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company_id: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // company_id를 정수로 변환
      const formData = {
        ...form,
        company_id: parseInt(form.company_id) || 1  // 문자열을 정수로 변환, 실패하면 기본값 1
      };
  
      const response = await fetch("http://localhost:8000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  // 변환된 데이터 사용
        credentials: "include"
      });
  
      if (!response.ok) {
        const errData = await response.json();
        
        // 특정 에러 메시지 처리
        if (errData.detail === "Email already registered") {
          throw new Error("이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.");
        } else if (errData.detail) {
          throw new Error(errData.detail);
        } else {
          throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      }
  
      // 회원가입 성공 시 사용자 정보를 store에 저장
      useAuthStore.getState().login({
        name: form.name,
        email: form.email,
        company_id: parseInt(form.company_id) || 1
      }); // 회원가입 시에는 토큰이 없으므로 제거
  
      alert("회원가입 성공!");
      navigate("/dashboard") 
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
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">이메일</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
                value={form.email}
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
