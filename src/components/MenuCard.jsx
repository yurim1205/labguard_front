// MenuCard.jsx: 카드형 메뉴 컴포넌트 (각 카드별 배경색, 클릭 시 링크 이동)
import styled from 'styled-components';
import { FaBook, FaFlask, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// 카드별 배경색 지정 함수
const getBgColor = (type) => {
  if (type === 'manual') return '#f3f4f6'; // 연회색
  if (type === 'lab') return '#e9ecef';   // 조금 더 진한 회색
  return '#f5f5f5'; // 기본 회색
};

const Card = styled.div`
  background: #f8fafb;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem 1.5rem;
  min-width: 220px;
  max-width: 260px;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(33,140,90,0.12);
  }
`;

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-decoration: none;
  color: inherit;
`;

const IconBox = styled.div`
  font-size: 2.8rem;
  color: #218c5a;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  cursor: pointer;
`;

const Desc = styled.p`
  font-size: 1rem;
  color: #444;
  margin: 0;
  text-align: center;
  cursor: pointer;
`;

function MenuCard({ icon, title, desc, link }) {
  // icon prop에 따라 아이콘 변경
  let IconComponent;
  if (icon === 'manual') IconComponent = FaBook;
  else if (icon === 'lab') IconComponent = FaFlask;
  else IconComponent = FaClipboardList;

  return (
    <Card $bg={getBgColor(icon)}>
      {/* 카드 전체를 Link로 감싸서 아이콘/제목/설명 클릭 시 이동 */}
      <CardLink to={link}>
        <IconBox><IconComponent /></IconBox>
        <Title>{title}</Title>
        <Desc>{desc}</Desc>
      </CardLink>
    </Card>
  );
}

export default MenuCard; 