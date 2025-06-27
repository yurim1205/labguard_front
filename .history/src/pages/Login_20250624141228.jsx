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
      console.log('로그인 시도:', { email: form.email, password: '***' });
      
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      console.log('로그인 응답 상태:', response.status, response.statusText);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = "로그인 실패";
        
        try {
          const errData = await response.json();
          console.error('로그인 에러 상세:', errData);
          
          if (response.status === 401) {
            // 더 구체적인 401 에러 메시지
            if (errData.detail && errData.detail.includes('password')) {
              errorMessage = "비밀번호가 틀렸습니다. 다시 확인해주세요.";
            } else if (errData.detail && errData.detail.includes('email')) {
              errorMessage = "등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.";
            } else {
              errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.\n\n등록된 계정이라면 비밀번호를 확인해주세요.\n등록되지 않은 계정이라면 회원가입을 진행해주세요.";
            }
          } else if (response.status === 422) {
            errorMessage = "입력 정보가 올바르지 않습니다. 이메일과 비밀번호를 확인해주세요.";
          } else {
            errorMessage = errData.detail || errData.message || errorMessage;
          }
        } catch (jsonError) {
          console.error('에러 응답 파싱 실패:', jsonError);
          if (response.status === 401) {
            errorMessage = "로그인 정보가 올바르지 않습니다.\n\n• 이메일과 비밀번호를 다시 확인해주세요\n• 계정이 없다면 회원가입을 진행해주세요";
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login response:", data);

      try {
        const userResponse = await fetch("/api/user/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          useAuthStore.getState().login({
            name: userData.name || form.email,
            email: userData.email || form.email,
            company_id: userData.company_id,
          });
        } else {
          useAuthStore.getState().login({
            name: form.email,
            email: form.email,
            company_id: 1,
          });
        }
      } catch {
        useAuthStore.getState().login({
          name: form.email,
          email: form.email,
          company_id: 1,
        });
      }

      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (err) {
      console.error('로그인 전체 에러:', err);
      
      // 네트워크 에러와 서버 에러 구분
      if (err.message === 'Failed to fetch') {
        alert("❌ 서버에 연결할 수 없습니다.\n\n• 백엔드 서버가 실행중인지 확인해주세요\n• 네트워크 연결을 확인해주세요");
      } else {
        alert("❌ " + err.message);
      }
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
