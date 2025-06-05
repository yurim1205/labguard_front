// Header.jsx: 상단 헤더 (LAB GUARD 좌측, 메뉴 중앙)
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

// 연한 녹색 계열 배경
const HeaderContainer = styled.header`
  width: 100%;
  padding: 1.5rem 0 1.5rem 0;
  background: linear-gradient(90deg, #d0f5e8 60%, #f8fafb 100%);
  display: flex;
  align-items: center;
  position: relative;
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  position: absolute;
  left: 3.5rem;
`;

const Title = styled.h1`
  color: #218c5a;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0 0 0 150px;
  letter-spacing: 2px;
  cursor: pointer;
`;

const Menu = styled.nav`
  display: flex;
  align-items: center;
  gap: 5rem;
  margin: 0 auto;
`;

const MenuItem = styled(Link)`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#218c5a' : '#222')};
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2.5px solid ${({ $active }) => ($active ? '#218c5a' : 'transparent')};
  transition: color 0.2s, border-bottom 0.2s;
  &:hover {
    color: #176b43;
  }
`;

function Header() {
  const location = useLocation();
  // 메뉴 정보
  const menus = [
    { label: '메뉴얼', to: '/manual' },
    { label: '실험', to: '/lab' },
    { label: '리포트', to: '/report' },
  ];
  return (
    <HeaderContainer>
      <TitleLink to="/">
        <Title>LAB GUARD</Title>
      </TitleLink>
      <Menu>
        {menus.map((menu) => (
          <MenuItem
            key={menu.to}
            to={menu.to}
            $active={location.pathname.startsWith(menu.to)}
          >
            {menu.label}
          </MenuItem>
        ))}
      </Menu>
    </HeaderContainer>
  );
}

export default Header;
