import { useAuthStore } from "../store/useAuthStore";

// 토큰 갱신 함수
export const refreshToken = async () => {
  try {
    console.log('🔄 토큰 갱신 시도');
    
    const response = await fetch("/api/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const newToken = data.access_token;
      
      console.log('🔄 토큰 갱신 성공');
      
      // 현재 사용자 정보 유지하면서 새 토큰 저장
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().login(currentUser, newToken);
      }
      
      return newToken;
    } else {
      console.log('🔄 토큰 갱신 실패');
      useAuthStore.getState().logout();
      return null;
    }
  } catch (error) {
    console.error('🔄 토큰 갱신 에러:', error);
    useAuthStore.getState().logout();
    return null;
  }
};

// 토큰 자동 갱신 타이머 설정
let refreshTimer = null;

export const startTokenRefreshTimer = () => {
  // 기존 타이머가 있으면 정리
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  
  // 10분마다 토큰 갱신 시도 (토큰 만료 전에 미리 갱신)
  refreshTimer = setInterval(async () => {
    const { isLoggedIn } = useAuthStore.getState();
    
    if (isLoggedIn) {
      console.log('🔄 주기적 토큰 갱신 확인');
      await refreshToken();
    }
  }, 10 * 60 * 1000); // 10분
  
  console.log('🔄 토큰 자동 갱신 타이머 시작');
};

export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
    console.log('🔄 토큰 자동 갱신 타이머 중지');
  }
};

// 페이지 포커스 시 토큰 상태 확인
export const setupTokenRefreshOnFocus = () => {
  const handleFocus = async () => {
    const { isLoggedIn } = useAuthStore.getState();
    
    if (isLoggedIn) {
      console.log('🔄 페이지 포커스 - 토큰 상태 확인');
      
      try {
        const response = await fetch("/api/user/me", {
          method: "GET",
          credentials: "include",
        });
        
        if (response.status === 401) {
          console.log('🔄 토큰 만료 감지 - 갱신 시도');
          await refreshToken();
        }
      } catch (error) {
        console.error('🔄 토큰 상태 확인 에러:', error);
      }
    }
  };
  
  window.addEventListener('focus', handleFocus);
  
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}; 