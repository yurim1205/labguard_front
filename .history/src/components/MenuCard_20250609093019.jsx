// MenuCard.jsx: 대시보드의 카드형 메뉴 컴포넌트
import { Link } from 'react-router-dom';
import { FaFlask, FaBook, FaFileAlt } from 'react-icons/fa';

const icons = {
  manual: <FaBook className="text-3xl text-green-700" />,
  lab: <FaFlask className="text-3xl text-green-700" />,
  report: <FaFileAlt className="text-3xl text-green-700" />,
};

function MenuCard({ icon, title, desc, link }) {
  return (
    <Link to={link} className="block bg-white text-neutral-900 rounded-xl shadow-md p-8 w-72 hover:shadow-lg transition-shadow duration-200 no-underline">
      <div className="flex flex-col items-center gap-4">
        <div>{icons[icon]}</div>
        <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center text-sm mb-2">{desc}</p>
      </div>
    </Link>
  );
}

export default MenuCard; 