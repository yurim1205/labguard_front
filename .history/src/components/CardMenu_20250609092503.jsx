// CardMenu.jsx: 대시보드의 카드형 메뉴 컴포넌트
import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  color: #222;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin: 1rem 0;
  min-width: 200px;
`;

function CardMenu({ title, children }) {
  return (
    <div className="bg-white text-neutral-900 rounded-xl shadow-md p-6 my-4 min-w-[200px]">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

export default CardMenu; 