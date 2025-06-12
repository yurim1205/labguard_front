// Header.jsx: 상단 헤더 (LAB GUARD 좌측, 메뉴 중앙)
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  // 메뉴 정보
  const menus = [
    { label: '메뉴얼', to: '/manual' },
    { label: '실험', to: '/lab' },
    { label: '리포트', to: '/report' },
  ];
  return (
    <header className="w-full py-6 bg-gradient-to-r from-[#d0f5e8] via-[#d0f5e8] to-[#f8fafb] flex items-center relative">
      <Link to="/" className="absolute left-14 no-underline">
        <h1 className="text-[#218c5a] text-[1.5rem] font-black m-0 ml-[150px] tracking-widest cursor-pointer">LAB GUARD</h1>
      </Link>
      {/* <nav className="flex items-center gap-20 mx-auto">
        {menus.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className={`text-[1.15rem] font-bold pb-0.5 no-underline border-b-2 transition-colors duration-200 ${location.pathname.startsWith(menu.to) ? 'text-[#218c5a] border-[#218c5a]' : 'text-[#222] border-transparent'} hover:text-[#176b43]`}
          >
            {menu.label}
          </Link>
        ))}
      </nav> */}
    </header>
  );
}

export default Header;