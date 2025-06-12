import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import RecentUpdateTable from '../components/RecentUpdateTable';
import manual from '../assets/img/manual.png';
import experiment from '../assets/img/experiment.png';
import report from '../assets/img/report.png';

function Dashboard() {
  // 카드 메뉴 데이터
  const cards = [
    {
      img: '/assets/img/manual.png',
      title: '매뉴얼 등록 및 분석',
      desc: 'PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.',
      link: '/manual',
    },
    {
      img: '/assets/img/experiment.png',
      title: '실험하기',
      desc: '실험실 장비 등의 데이터를 불러와 음성으로 안전 경고와 가이드를 제공합니다.',
      link: '/lab',
    },
    {
      img: '/assets/img/report.png',
      title: '리포트 확인',
      desc: '실험 상세 리포트를 확인하고 다운 받을 수 있습니다.',
      link: '/report',
    },
  ];

  // 최근 업데이트 더미 데이터
  const updates = [
    { type: '매뉴얼', date: '2024-06-02 12:01', title: '저장 수소 생산', link: '#' },
    { type: '실험일지', date: '2024-06-02 10:22', title: '수소저장 실험 일지', link: '#' },
  ];

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto">
        <h2 className="text-2xl mb-10 text-neutral-900 font-normal">
          안녕하세요, <span className="font-bold">{}</span>님
        </h2>
        <div className="flex gap-[20px] justify-center">
          {cards.map((card, idx) => (
            <MenuCard key={idx} icon={card.icon} title={card.title} desc={card.desc} link={card.link} />
          ))}
        </div>
        {/* <RecentUpdateTable updates={updates} /> */}
      </main>
    </>
  );
}

export default Dashboard; 