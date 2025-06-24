import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // 전역 상태관리 store
import ArrowImg from "../assets/img/downArrow.png";
import LogoutModal from "./modal/logoutModal";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user); // 사용자 정보 가져오기
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/user/logout", {
        method: "POST",
        credentials: "include", // ✅ 쿠키 포함
      });

      logout();           // 상태 초기화
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      alert("로그아웃 실패: " + err.message);
    }
  };

  const menus = [
    { label: "매뉴얼", to: "/manual" },
    { label: "실험", to: "/ExperimentMain" },
    { label: "리포트", to: "/ReportMain" },
  ];

  return (
    <header className="w-full h-[60px] bg-gradient-to-r from-[#76ACFF] to-[#FFFFFF] m-0 p-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 h-full">
        {/* 왼쪽: 로고 */}
        <div className="flex-1">
          <Link to="/dashboard" className="no-underline">
            <h1 className="cursor-pointer font-sans text-[#33308B] text-[24px] font-extrabold tracking-widest ml-[60px] whitespace-nowrap">
              LAB GUARD
            </h1>
          </Link>
        </div>

        {/* 중앙: 메뉴 */}
        <nav className="flex-1 flex justify-center gap-[128px] items-center">
          {menus.map((menu) => (
            <Link
              key={menu.to}
              to={menu.to}
              className={`font-pretendard text-[#1A237E] text-lg font-extrabold no-underline whitespace-nowrap transition-colors duration-200 ${
                location.pathname.startsWith(menu.to) ? 'underline' : ''
              }`}
            >
              {menu.label}
            </Link>
          ))}
        </nav>

        {/* 오른쪽: 사용자 이름과 로그아웃 버튼 */}
        <div className="flex-1 flex justify-end pr-[60px] items-center gap-4 relative">
          {user && (
            <span className="text-[#1A237E] text-sm font-semibold">
             <span className="font-bold">{user?.name || '사용자'}</span> 님
            </span>
          )}
           <img 
            src={ArrowImg} 
            alt="화살표" 
            className="w-[14px] h-[14px] mr-[10px] cursor-pointer" 
            onClick={() => setShowModal(!showModal)}
          />

          {/* <button
            onClick={handleLogout}
            className="text-[#1A237E] text-sm font-bold border border-[#1A237E] px-4 py-1 rounded-full hover:bg-[#1A237E] hover:text-white transition flex items-center gap-2"
          >
            로그아웃
          </button> */}

          {/* 모달 */}
          {showModal && (
            <div className="absolute top-full right-[60px] mt-2 z-50">
              <LogoutModal 
                onLogout={handleLogout}
                onWithdraw={() => {
                  // 탈퇴 로직 추가 예정
                  alert('탈퇴 기능은 준비 중입니다.');
                  setShowModal(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;