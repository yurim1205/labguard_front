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
      className="block bg-white w-[360px] h-[320px] rounded-[5px] p-10 shadow-[0_12px_24px_0_rgba(128,128,128,0.36)] 
                hover:shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] 
                hover:-translate-y-3 hover:scale-105 
                transition ease-in-out duration-300 transform no-underline"
    >

    <div className="flex flex-col items-center h-full justify-between gap-6">
      <div
        className="bg-[#FFFFFF] rounded-[5px] flex items-center justify-center mx-auto mb-6 mt-[12px]"
        style={{ width: "320px", height: "160px" }}
      >
        <img src={img} alt={title} className="object-contain w-[96px] h-[96px]" />
      </div>
      <div className="pl-[12px] pr-[12px] text-center">
        <h3 className="text-xl font-bold mb-2 text-[#33308B]">{title}</h3>
        <p className="text-gray-600 text-base mt-2">{desc}</p>
      </div>
    </div>
  </Link>
  
  );
}

export default MenuCard; 