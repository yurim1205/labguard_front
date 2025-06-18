import { Link, useLocation } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-[#0D51B7] to-[#FFFFFF] shadow-md m-0 p-0">
      <div className="w-full">
        <h1 className="text-[#218c5a] text-[1.5rem] font-black m-0 ml-[150px] tracking-widest cursor-default">
          LAB GUARD
        </h1>
      </div>
    </header>
  );
}
export default Header;