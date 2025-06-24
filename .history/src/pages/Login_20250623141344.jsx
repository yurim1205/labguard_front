import React, { useState } from "react";
import logo from "../assets/img/logo.png";
import LoginBtn from "../components/button/loginBtn";
import { Link, useNavigate  } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
            const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
      credentials: "include" // ✅ 쿠키 포함해서 요청
    });

    if (!response.ok) {
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      
      let errData = {};
      try {
        const responseText = await response.text();
        console.error("Response text:", responseText);
        
        if (responseText && responseText.trim().startsWith('{')) {
          errData = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
      }
      
      console.error("Error details:", errData);
      
      if (response.status === 401) {
        throw new Error(errData.detail || "이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        throw new Error(errData.detail || `로그인 실패 (${response.status})`);
      }
    }

    const data = await response.json();
    
    // 백엔드 응답 데이터 확인
    console.log('Login response data:', data);
    
    // 사용자 정보 가져오기
    try {
              const userResponse = await fetch("/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('User data:', userData);
        
        // 사용자 정보를 store에 저장
        useAuthStore.getState().login({
          name: userData.name || form.email,
          email: userData.email || form.email,
          company_id: userData.company_id
        });
      } else {
        // 사용자 정보 가져오기 실패 시 기본값 사용
        useAuthStore.getState().login({
          name: form.email, // 이메일을 이름으로 사용
          email: form.email,
          company_id: 1
        });
      }
    } catch (userError) {
      console.error('Failed to fetch user data:', userError);
      // 사용자 정보 가져오기 실패 시 기본값 사용
      useAuthStore.getState().login({
        name: form.email,
        email: form.email,
        company_id: 1
      });
    }

    alert("로그인 성공!");
    navigate("/dashboard"); 
  } catch (err) {
    alert("로그인 실패: " + err.message);
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
            </div>

            <div>
              <label className="block mb-2 text-[#837A7A] text-[14px] w-[300px]  h-[30px] mt-[30px]">비밀번호</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
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