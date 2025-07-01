import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import RecentUpdateTable from '../components/RecentUpdateTable';
import { useAuthStore } from '../store/useAuthStore';
import manual from '../assets/img/manual.png';
import experiment from '../assets/img/experiment.png';
import report from '../assets/img/report.png';

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  // 카드 메뉴 데이터
  const cards = [
    {
      img: manual,
      title: '매뉴얼 등록 및 분석',
      desc: 'PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.',
      link: '/manual',
    },
    {
      img: experiment,
      title: '실험하기',
      desc: '실험실 장비 등의 데이터를 불러와 음성으로 안전 경고와 가이드를 제공합니다.',
      link: '/ExperimentMain',
    },
    {
      img: report,
      imgSize: "w-[110px] h-[110px]",
      title: '리포트 확인',
      desc: '실험 상세 리포트를 확인하고 다운 받을 수 있습니다.',
      link: '/ReportMain',
    },
  ];

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto">
        <div className="flex gap-[20px] justify-center">
          {cards.map((card, idx) => (
            <MenuCard key={idx} img={card.img} title={card.title} desc={card.desc} link={card.link} imgSize={card.imgSize} />
          ))}
        </div>
      </main>
    </>
  );
}

export default Dashboard; 