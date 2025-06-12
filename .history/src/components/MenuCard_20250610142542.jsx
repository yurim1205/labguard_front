import { Link } from 'react-router-dom';
import { FaFlask, FaBook, FaFileAlt } from 'react-icons/fa';

const icons = {
  manual: <FaBook className="text-6xl text-gray-800 mb-6" />,
  lab: <FaFlask className="text-6xl text-gray-800 mb-6" />,
  report: <FaFileAlt className="text-6xl text-gray-800 mb-6" />,
};

function MenuCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="block bg-[#F5F6F7] rounded-xl shadow-md p-10 w-80 min-h-[320px] hover:shadow-lg transition-shadow duration-200 no-underline"
    >
      <div className="flex flex-col items-center h-full justify-between gap-6">
        <div className="bg-[#FFFFFF] rounded-md flex items-center justify-center mx-auto mb-6 mt-6" style={{ width: "120px", height: "120px" }}>
          {icons[icon]}
        </div>
        <h3 className="text-xl font-bold mb-2 text-[#33308B] text-center">{title}</h3>
        <p className="text-gray-600 text-center text-base mt-2">{desc}</p>
      </div>
    </Link>
  );
}

export default MenuCard; 