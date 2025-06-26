import React, { useState } from "react";
import logo from "../assets/img/logo.png";
import LoginBtn from "../components/button/loginBtn";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { z } from "zod";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z.string().min(8, { message: "비밀번호는 최소 8자이며, 숫자와 특수문자를 포함해야 합니다." }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // 실시간 유효성 검사
    if (name === "email") {
      const emailResult = loginSchema.shape.email.safeParse(value);
      if (!emailResult.success) {
        setErrors((prev) => ({ ...prev, email: emailResult.error.errors[0].message }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    } else if (name === "password") {
      const passwordResult = loginSchema.shape.password.safeParse(value);
      if (!passwordResult.success) {
        setErrors((prev) => ({ ...prev, password: passwordResult.error.errors[0].message }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "로그인 실패";
        
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errorMessage = errData.detail || "로그인 실패";
          } else {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            errorMessage = `서버 오류 (${response.status})`;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorMessage = `서버 응답 오류 (${response.status})`;
        }
        
        if (response.status === 401) {
          throw new Error("회원정보가 없습니다. 회원가입을 먼저 진행해주세요.");
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log("Login response:", data);

      try {
        // 사용자 정보 조회
        const userResponse = await fetch("/api/user/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });
        
        if (userResponse.ok) {
          try {
            const userData = await userResponse.json();
            console.log("User data received:", userData);
            
            useAuthStore.getState().login({
              id: userData.id || userData.user_id,
              name: userData.name || form.email,
              email: userData.email || form.email,
              company_id: userData.company_id,
            });
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            useAuthStore.getState().login({
              name: form.email,
              email: form.email,
              company_id: 1,
            });
          }
        } else {
          console.log("User data fetch failed, using form data");
          useAuthStore.getState().login({
            id: 1, // 기본값
            name: form.email,
            email: form.email,
            company_id: 1,
          });
        }
      } catch (error) {
        console.error("User data fetch error:", error);
        useAuthStore.getState().login({
          id: 1, // 기본값
          name: form.email,
          email: form.email,
          company_id: 1,
        });
      }

      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5D93E4] to-[#E2ECFF] gap-8">
      <div className="w-[500px] h-[700px] rounded-[40px] shadow-md items-center justify-start bg-[#FFFFFF] shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]">
        <div className="bg-white rounded-[40px] shadow-xl px-10 py-12 w-full max-w-[400px] flex flex-col items-start">
          <h2 className="text-[30px] font-extrabold mb-8 text-left justify-center items-center ml-[100px] mt-[80px]">Login</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 justify-center items-center ml-[50px]">
            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px] mt-[28px]">이메일</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-[#C9240E] text-[12px] mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px] mt-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-[#C9240E] text-[12px] mt-1 ml-1">{errors.password}</p>}
            </div>

            <LoginBtn type="submit">Login</LoginBtn>
          </form>

          <div className="mt-6 text-[12px] font-extrabold text-gray-400 flex items-center ml-[170px] mt-[12px]">
            계정이 없으신가요?&nbsp;
            <Link to="/signup" className="text-blue-700 font-bold no-underline">회원가입</Link>
            &nbsp;하기
          </div>
        </div>
      </div>

      <div className="w-[700px] h-[700px] items-center flex items-end">
        <img src={logo} alt="로그인 로고 이미지" className="max-w-md -translate-y-[162px] transform ml-[100px]" />
      </div>
    </div>
  );
}

export default Login;