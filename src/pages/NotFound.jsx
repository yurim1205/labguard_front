// NotFound.jsx: 404 페이지
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  margin: 5rem auto;
`;

function NotFound() {
  return (
    <NotFoundContainer>
      <h2>404</h2>
      <p>페이지를 찾을 수 없습니다.</p>
    </NotFoundContainer>
  );
}

export default NotFound; 