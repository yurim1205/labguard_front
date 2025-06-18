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
    <header className="w-full h-[60px] bg-gradient-to-r from-[#0D51B7] to-[#FFFFFF] m-0 p-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4 px-8">
        <h1 className="text-[#33308B] text-[24px] font-extrabold tracking-widest m-0 ml-[60px] mt-[10px]">LAB GUARD</h1>
        {/* <nav className="flex gap-16">
          {menus.map((menu) => (
            <Link
              key={menu.to}
              to={menu.to}
              className={`text-[#1A237E] text-lg font-bold no-underline transition-colors duration-200 ${location.pathname.startsWith(menu.to) ? 'underline' : ''}`}
            >
              {menu.label}
            </Link>
          ))}
        </nav> */}
      </div>
    </header>
  );
}

export default Header;

