// RecentUpdateTable.jsx: 최근 업데이트 표 컴포넌트
import styled from 'styled-components';

const TableContainer = styled.section`
  margin-top: 2.5rem;
  border: 1px solid #222;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 1rem 1rem 1rem;
`;

const Title = styled.h4`
  margin-bottom: 0.7rem;
  font-size: 1.1rem;
  color: #222;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.7rem 0.5rem;
  background: #f3f6fa;
  color: #218c5a;
  font-weight: 600;
  font-size: 1rem;
`;

const Td = styled.td`
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #eaeaea;
  font-size: 0.98rem;
`;

const TypeBtn = styled.span`
  display: inline-block;
  background: #e3f0ff;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.2rem 0.8rem;
  margin-right: 0.5rem;
`;

const Link = styled.a`
  color: #218c5a;
  text-decoration: underline;
  font-size: 0.98rem;
  &:hover {
    color: #176b43;
  }
`;

function RecentUpdateTable({ updates }) {
  return (
    <>
      <Title>최근 업데이트</Title>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>구분</Th>
              <Th>일시</Th>
              <Th>제목</Th>
              <Th>바로가기</Th>
            </tr>
          </thead>
          <tbody>
            {updates.map((item, idx) => (
              <tr key={idx}>
                <Td><TypeBtn>{item.type}</TypeBtn></Td>
                <Td>{item.date}</Td>
                <Td>{item.title}</Td>
                <Td><Link href={item.link}>상세 보기</Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RecentUpdateTable; 