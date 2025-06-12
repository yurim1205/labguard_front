// Header.jsx: 상단 헤더 (LAB GUARD 좌측, 메뉴 중앙)
import { Link, useLocation } from 'react-router-dom';

// function Header() {
//   const location = useLocation();
//   // 메뉴 정보
//   const menus = [
//     { label: '메뉴얼', to: '/manual' },
//     { label: '실험', to: '/lab' },
//     { label: '리포트', to: '/report' },
//   ];
//   return (
//     <header className="w-full py-6 bg-gradient-to-r from-[#d0f5e8] via-[#d0f5e8] to-[#f8fafb] flex items-center relative">
//       <Link to="/" className="absolute left-14 no-underline">
//         <h1 className="text-[#218c5a] text-[1.5rem] font-black m-0 ml-[150px] tracking-widest cursor-pointer">LAB GUARD</h1>
//       </Link>
//       <nav className="flex items-center gap-20 mx-auto">
//         {menus.map((menu) => (
//           <Link
//             key={menu.to}
//             to={menu.to}
//             className={`text-[1.15rem] font-bold pb-0.5 no-underline border-b-2 transition-colors duration-200 ${location.pathname.startsWith(menu.to) ? 'text-[#218c5a] border-[#218c5a]' : 'text-[#222] border-transparent'} hover:text-[#176b43]`}
//           >
//             {menu.label}
//           </Link>
//         ))}
//       </nav>
//     </header>
//   );
// }

import React, { useState } from "react";
// import Logo from "./logo";
// import NavLink from "./navLink";
// import MobileMenu from "./mobileMenu";

const Header = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (sectionId == "top") {
      window.scrollTo({
        top: 0,              // 맨 위로 스크롤
        behavior: "smooth",  // 스크롤이 부드러워지는 옵션
      });
    } else {                 // 아이디가 top이 아니면 각 페이지로 이동
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header className="bg-[#294122] text-[#FFEDD2] p-4 w-full fixed top-0 left-0 z-50 font-sans">
      <div className="flex justify-between items-center mx-auto">
        <Logo scrollTo={() => scrollToSection("top")} />

        {/* <div className="md:hidden ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <button className="text-3xl">☰</button>
        </div> */}

        {/* <nav className="hidden md:flex md:flex-row md:space-x-6">
          <ul className="flex space-x-6">
            {["about", "stack", "project", "contact"].map((id) => (
              <NavLink
                key={id}
                id={id}
                section={id.toUpperCase()}
                activeSection={activeSection}
                onClick={scrollToSection}
              />
            ))}
          </ul>
        </nav> */}
      </div>

      {/* 반응형 부분 */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
    </header>
  );
};

export default Header;