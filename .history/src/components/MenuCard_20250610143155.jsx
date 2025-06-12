import { Link } from 'react-router-dom';
import { FaFlask, FaBook, FaFileAlt } from 'react-icons/fa';

const icons = {
  manual: <FaBook size={64} className="text-[#6C3DD1]" />,
  lab: <FaFlask size={64} className="text-[#6C3DD1]" />,
  report: <FaFileAlt size={72} className="text-[#6C3DD1]" />,
};

function MenuCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="block bg-[#F5F6F7] rounded-xl shadow-md p-10 w-80 min-h-[320px] hover:shadow-lg transition-shadow duration-200 no-underline"
    >
      <div className="flex flex-col items-center h-full justify-between gap-6">
        <div className="bg-[#FFFFFF] rounded-md flex items-center justify-center mx-auto mb-6 mt-[48px]" style={{ width: "240px", height: "160px" }}>
          {icons[icon]}
        </div>
        <h3 className="text-xl font-bold mb-2 text-[#33308B] text-center">{title}</h3>
        <p className="text-gray-600 text-center text-base mt-2">{desc}</p>
      </div>
    </Link>
  );
}

export default MenuCard; 