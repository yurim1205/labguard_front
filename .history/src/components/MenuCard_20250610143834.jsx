import { Link } from 'react-router-dom';
import { FaFlask, FaBook, FaFileAlt } from 'react-icons/fa';

const icons = {
  manual: <FaBook size={96} className="text-[#6C3DD1]" />,
  lab: <FaFlask size={96} className="text-[#6C3DD1]" />,
  report: <FaFileAlt size={96} className="text-[#6C3DD1]" />,
};

function MenuCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="block bg-[#F5F6F7] w-[360px] h-[320px] rounded-xl shadow-md p-10 w-80 min-h-[320px] hover:shadow-lg transition-shadow duration-200 no-underline"
    >
      <div className="flex flex-col items-center h-full justify-between gap-6">
        <div
          className="bg-[#FFFFFF] rounded-md flex items-center justify-center mx-auto mb-6"
          style={{ width: "200px", height: "150px" }}
        >
          {icons[icon]}
        </div>
        <h3 className="text-xl font-bold mb-2 text-[#33308B] text-start">{title}</h3>
        <p className="text-gray-600 text-start text-base mt-2">{desc}</p>
      </div>
    </Link>
  );
}

export default MenuCard; 