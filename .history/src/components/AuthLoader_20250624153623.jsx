// src/components/AuthLoader.jsx
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { fetchWithTokenRetry } from "../utils/fetchWithAuth";

const AuthLoader = () => {
  const { login, logout, isLoggedIn } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 AuthLoader - 인증 상태 확인 시작');
        
        // fetchWithTokenRetry를 사용하여 자동 토큰 갱신 적용
        const res = await fetchWithTokenRetry("/api/user/me", {
          method: "GET",
        });

        console.log('🔐 AuthLoader - 사용자 정보 응답:', res.status);

        if (res.ok) {
          const userData = await res.json();
          console.log('🔐 AuthLoader - 사용자 데이터:', userData);
          
          login({
            name: userData.name,
            email: userData.email,
            company_id: userData.company_id,
          });
          
          console.log('🔐 AuthLoader - 로그인 상태 복원 완료');
        } else if (res.status === 401) {
          console.log('🔐 AuthLoader - 인증 실패, 로그아웃 처리');
          logout();
        }
      } catch (error) {
        console.error('🔐 AuthLoader - 인증 확인 에러:', error);
        logout();
      }
    };

    // 이미 로그인 상태가 아닐 때만 인증 확인
    if (!isLoggedIn) {
      checkAuth();
    }
  }, [isLoggedIn, login, logout]);

  return null;
};

export default AuthLoader;
