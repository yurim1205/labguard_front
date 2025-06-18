import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const menus = [
    { label: "메뉴얼", to: "/manual" },
    { label: "실험", to: "/lab" },
    { label: "리포트", to: "/report" },
  ];

  const user = {
    id: "랩가드", // 사용자 이름
  };

  return (
    <header className="w-full h-[60px] bg-gradient-to-r from-[#76ACFF] to-[#FFFFFF] m-0 p-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 h-full">
        
        {/* 로고 */}
        <div className="flex-1">
          <h1 className="font-sans text-[#33308B] text-[24px] font-extrabold tracking-widest ml-[60px] whitespace-nowrap">
            LAB GUARD
          </h1>
        </div>

        {/* 메뉴 */}
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

        {/* 사용자 이름 표시 */}
        <div className="flex-1 flex justify-end pr-[60px]">
          <span className="font-pretendard text-[#1A237E] text-[16px] font-semibold whitespace-nowrap">
            안녕하세요, <span className="text-[#004d40] font-bold">{user.id}</span>님
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
