import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const menus = [
    { label: "메뉴얼", to: "/manual" },
    { label: "실험", to: "/lab" },
    { label: "리포트", to: "/report" },
  ];
  return (
    <header className="w-full h-[60px] bg-gradient-to-r from-[#76ACFF] to-[#FFFFFF] m-0 p-0">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between px-8 h-full">
      
      <div className="flex-1">
        <h1 className="text-[#33308B] text-[24px] font-extrabold tracking-widest ml-[60px]">
          LAB GUARD
        </h1>
      </div>

      <nav className="flex-1 flex justify-center gap-[128px] items-center">
        {menus.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className={`text-[#1A237E] text-lg font-bold no-underline transition-colors duration-200 ${
              location.pathname.startsWith(menu.to) ? 'underline' : ''
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />
    </div>
  </header>
  );
}

export default Header;