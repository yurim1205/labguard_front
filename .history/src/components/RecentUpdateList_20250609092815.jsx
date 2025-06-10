// RecentUpdateList.jsx: 최근 업데이트 항목 리스트 컴포넌트
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

function RecentUpdateList({ updates = [] }) {
  return (
    <ul className="list-none p-0 m-0">
      {updates.length === 0 ? (
        <li className="py-2 border-b border-gray-200">업데이트 내역이 없습니다.</li>
      ) : (
        updates.map((item, idx) => <li className="py-2 border-b border-gray-200" key={idx}>{item}</li>)
      )}
    </ul>
  );
}

export default RecentUpdateList; 