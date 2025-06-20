import React, { useState } from "react";
import logo from "../assets/img/logo.png";
import LoginBtn from "../components/button/loginBtn";
import { Link, useNavigate  } from "react-router-dom";

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
    const response = await fetch("http://localhost:8000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "로그인 실패");
    }

    const data = await response.json();
    const token = data.access_token;

    localStorage.setItem("token", token); // 토큰 저장
    alert("로그인 성공!");
    navigate("/dashboard"); // 대시보드 페이지로 이동
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
              <label className="block text-[#837A7A] text-[14px] w-[300px] h-[30px] mt-[28px]">이름</label>
              <input
                className="border border-[#3C66B8] rounded-full px-5 py-2 w-full h-[36px] focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                type="name"
                name="name"
                value={form.name}
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