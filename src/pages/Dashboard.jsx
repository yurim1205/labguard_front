import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
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
      desc: '실험의 데이터를 불러와 안전 경고와 가이드를 제공합니다.',
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
      <main>
        <section className="h-[400px] bg-gradient-to-r from-[#006F98] to flex flex-col justify-center items-center text-[#FFFFFF]">
          <h1 className="text-3xl font-bold mb-4 justify-start items-start">실험실 사고를 줄이고, 업무 효율은 높이세요</h1>
          <p className="text-xl">실험실 전용 AI 어시스턴트로 안전한 연구 환경을 구축하세요.</p>
        </section>

        {/* 아래 카드 메뉴 영역 */}
        <section className="relative max-w-[1400px] mx-auto mt-[50px] z-10 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-wrap justify-center gap-[12px]">
            {cards.map((card, idx) => (
              <MenuCard
                key={idx}
                img={card.img}
                title={card.title}
                desc={card.desc}
                link={card.link}
                imgSize={card.imgSize}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;