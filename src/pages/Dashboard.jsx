// Dashboard.jsx: 메인 페이지 (카드형 메뉴 + 최근 업데이트)
import MenuCard from '../components/MenuCard';
import RecentUpdateTable from '../components/RecentUpdateTable';
import styled from 'styled-components';

const MainContainer = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
`;

const Greeting = styled.h2`
  font-size: 2rem;
  margin: 2rem 0 2.5rem 0;
  color: #222;
  font-weight: 400;
  & span {
    font-weight: bold;
  }
`;

const CardRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  justify-content: center;
`;

function Dashboard() {
  // 카드 메뉴 데이터
  const cards = [
    {
      icon: 'manual',
      title: '매뉴얼 등록 및 분석',
      desc: 'PDF 매뉴얼 등록 및 분석 결과 확인, AI 기반 장비 매뉴얼 관리',
      link: '/manual',
    },
    {
      icon: 'lab',
      title: '실험일지',
      desc: '실험일지 작성 및 관리, 실험 데이터 통계와 트렌드 확인',
      link: '/lab',
    },
    {
      icon: 'report',
      title: '리포트 확인',
      desc: '실험 결과 리포트 다운로드 및 공유, 리포트 이력 관리',
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
      <MainContainer>
        <Greeting>안녕하세요, <span>{}</span>님</Greeting>
        <CardRow>
          {cards.map((card, idx) => (
            <MenuCard key={idx} icon={card.icon} title={card.title} desc={card.desc} link={card.link} />
          ))}
        </CardRow>
        <RecentUpdateTable updates={updates} />
      </MainContainer>
    </>
  );
}

export default Dashboard; 