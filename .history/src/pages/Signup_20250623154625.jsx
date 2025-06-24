import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import SignupBtn from "../components/button/signupBtn";
import leftArrow from "../assets/img/leftArrow.png";
import { z } from "zod";

// 📌 Zod 스키마
const signupSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("유효한 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  company_id: z.string().min(1, "기업 ID를 입력해주세요."),
});

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company_id: '',
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [formTouched, setFormTouched] = useState(false); // 최초 제출 여부

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // 실시간 유효성 검사
    try {
      signupSchema.parse(newForm);
      setErrorMessages({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrorMessages(newErrors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true); // 🔔 최초 제출 감지

    try {
      signupSchema.parse(form);
      setErrorMessages({}); // 통과 시 초기화

      const formData = {
        ...form,
        company_id: parseInt(form.company_id) || 1
      };

      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.detail === "Email already registered") {
          setErrorMessages({ email: "이미 등록된 이메일입니다. 다른 이메일을 사용해주세요." });
        } else if (errData.detail) {
          setErrorMessages({ general: errData.detail });
        } else {
          setErrorMessages({ general: "회원가입에 실패했습니다. 다시 시도해주세요." });
        }
        return;
      }

      useAuthStore.getState().login({
        name: form.name,
        email: form.email,
        company_id: parseInt(form.company_id) || 1
      });

      navigate("/dashboard");

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrorMessages(newErrors);
      } else {
        setErrorMessages({ general: "회원가입 중 오류가 발생했습니다." });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5D93E4] to-[#E2ECFF] gap-8 relative">
      <img 
        src={leftArrow} 
        alt="leftArrow" 
        className="w-[20px] h-[20px] absolute top-[20px] left-[20px] cursor-pointer" 
        onClick={() => navigate("/login")}
      />
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF] shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]">
        <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[400px] flex flex-col items-start">
          <h2 className="text-[30px] font-extrabold mb-8 text-left justify-center items-center ml-[100px] mt-[80px]">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="items-center w-full flex flex-col justify-center ml-[50px] space-y-[12px]">

            {/* 이름 */}
            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">사용자 이름</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errorMessages.name && (
                <p className="text-orange-600 text-xs mt-1">{errorMessages.name}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">이메일</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errorMessages.email && (
                <p className="text-orange-600 text-xs mt-1">{errorMessages.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {errorMessages.password && (
                <p className="text-orange-600 text-xs mt-1">{errorMessages.password}</p>
              )}
            </div>

            {/* 기업 ID */}
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

            {/* 일반 에러 */}
            {formTouched && errorMessages.general && (
              <p className="text-orange-600 text-center text-xs mt-2">{errorMessages.general}</p>
            )}

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
