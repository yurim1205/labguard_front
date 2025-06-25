import { useAuthStore } from "../store/useAuthStore";

export const fetchWithTokenRetry = async (url, options = {}) => {
  console.log('🔄 fetchWithTokenRetry 호출:', url);
  
  // 첫 번째 요청
  let res = await fetch(url, { ...options, credentials: "include" });
  console.log('🔄 첫 번째 요청 응답:', res.status);

  if (res.status === 401) {
    console.log('🔄 401 에러 - 토큰 갱신 시도');
    
    try {
      // 토큰 갱신 시도
      const refreshRes = await fetch("/api/token/refresh", {
        method: "POST",
        credentials: "include", // HttpOnly 쿠키 사용
      });

      console.log('🔄 토큰 갱신 응답:', refreshRes.status);

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newToken = data.access_token;
        console.log('🔄 새 토큰 발급 성공');

        // Zustand 상태 갱신
        const currentUser = useAuthStore.getState().user;
        useAuthStore.getState().login(currentUser, newToken);

        // 원래 요청 재시도
        res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });
        
        console.log('🔄 재시도 요청 응답:', res.status);
      } else {
        console.log('🔄 토큰 갱신 실패 - 로그아웃 처리');
        // 재발급 실패 시 로그아웃
        useAuthStore.getState().logout();
        
        // 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('🔄 토큰 갱신 중 에러:', error);
      useAuthStore.getState().logout();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return res;
};