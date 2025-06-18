// Login.jsx: 로그인 페이지
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

function Login() {
  return (
    <LoginContainer>
      <h2>로그인</h2>
      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label>아이디<br /><input type="text" name="username" /></label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>비밀번호<br /><input type="password" name="password" /></label>
        </div>
        <button type="submit">로그인</button>
      </form>
    </LoginContainer>
  );
}

export default Login; 