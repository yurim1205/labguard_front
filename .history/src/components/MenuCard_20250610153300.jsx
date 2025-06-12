import { Link } from 'react-router-dom';

const imgs = {
  manual: <img src="/assets/img/manual.png" alt="매뉴얼" className="w-[96px] h-[96px] mt-[48px]" />,
  experiment: <img src="/assets/img/experiment.png" alt="실험" className="w-[96px] h-[96px]" />,
  report: <img src="/assets/img/report.png" alt="리포트" className="w-[96px] h-[96px]" />,
};

function MenuCard({ img, title, desc, link }) {
  // 카드별로 컨테이너 크기 지정
  let containerStyle = { width: "200px", height: "150px" };

  if (title === "매뉴얼 등록 및 분석") {
    containerStyle = { width: "210px", height: "200px" };
  } else if (title === "실험하기") {
    containerStyle = { width: "210px", height: "200px" };
  } else if (title === "리포트 확인") {
    containerStyle = { width: "210px", height: "200px" };
  }

  return (
    <Link
      to={link}
      className="block bg-[#EBEAE5] w-[360px] h-[320px] rounded-xl shadow-md p-10 hover:shadow-lg transition-shadow duration-200 no-underline"
    >
      <div className="flex flex-col items-center h-full justify-between gap-6">
        <div
          className="bg-[#FFFFFF] rounded-md flex items-center justify-center mx-auto mb-6 mt-[48px]"
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