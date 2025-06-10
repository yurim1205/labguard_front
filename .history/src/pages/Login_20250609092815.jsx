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
    <div className="max-w-[400px] my-16 mx-auto p-8 bg-white rounded-xl shadow-md">
      <h2>로그인</h2>
      <form>
        <div className="mb-4">
          <label>아이디<br /><input className="border rounded px-2 py-1 w-full mt-1" type="text" name="username" /></label>
        </div>
        <div className="mb-4">
          <label>비밀번호<br /><input className="border rounded px-2 py-1 w-full mt-1" type="password" name="password" /></label>
        </div>
        <button className="w-full bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded" type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login; 