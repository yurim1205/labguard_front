import { Link } from 'react-router-dom';

const imgs = {
  manual: <img src="/assets/img/manual.png" alt="매뉴얼" className="w-[96px] h-[96px]" />,
  experiment: <img src="/assets/img/experiment.png" alt="실험" className="w-[96px] h-[96px] mt-[96px]" />,
  report: <img src="/assets/img/report.png" alt="리포트" className="w-[96px] h-[96px]" />,
};

function MenuCard({ img, title, desc, link }) {
  let containerStyle = { width: "210px", height: "160px", };

  if (title === "매뉴얼 등록 및 분석" || title === "실험하기") {
    containerStyle = { width: "210px", height: "200px" }; 
  } else if (title === "리포트 확인") {
    containerStyle = { width: "210px", height: "200px" };
  }

  return (
    <Link
      to={link}
      className="block bg-[#EBEAE5] w-[360px] h-[320px] rounded-[40px] shadow-md p-10 hover:shadow-lg transition-shadow duration-200 no-underline"
    >
      <div className="flex flex-col items-center h-full justify-between gap-6">
        <div
          className="bg-[#FFFFFF] rounded-md flex items-center justify-center mx-auto mb-6 mt-6"
          style={containerStyle}
        >
          <img src={img} alt={title} className="object-contain w-[96px] h-[96px]" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-[#33308B]">{title}</h3>
        <p className="text-gray-600 text-start text-base mt-2">{desc}</p>
      </div>
    </Link>
  );
}

export default MenuCard; 