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
    <List>
      {updates.length === 0 ? (
        <ListItem>업데이트 내역이 없습니다.</ListItem>
      ) : (
        updates.map((item, idx) => <ListItem key={idx}>{item}</ListItem>)
      )}
    </List>
  );
}

export default RecentUpdateList; 