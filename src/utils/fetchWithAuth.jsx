import { useAuthStore } from "../store/useAuthStore";

// fetch 래퍼 - 401 에러 시 토큰 갱신 시도 후 로그아웃 처리
export const fetchWithAuth = async (url, options = {}) => {
  console.log('🌐 API 요청:', url);
  
  const response = await fetch(url, { 
    ...options, 
    credentials: "include" 
  });
  
  console.log('🌐 API 응답:', response.status);

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    console.log('토큰 만료 감지 - 갱신 시도');
    
    // refresh token으로 토큰 갱신 시도
    try {
      const refreshResponse = await fetch('/api/user/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (refreshResponse.ok) {
        console.log('토큰 갱신 성공 - 원본 요청 재시도');
        
        // 토큰 갱신 성공 시 원래 요청 재시도
        const retryResponse = await fetch(url, { 
          ...options, 
          credentials: "include" 
        });
        
        console.log('재시도 응답:', retryResponse.status);
        return retryResponse;
      } else {
        console.log('토큰 갱신 실패 - 로그아웃 처리');
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.log('토큰 갱신 중 오류:', error.message);
      
      // 토큰 갱신 실패 시 로그아웃
      useAuthStore.getState().logout();
      
      if (typeof window !== 'undefined') {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }
  }

  return response;
};

// 기존 이름과의 호환성을 위해 별칭 제공
export const fetchWithTokenRetry = fetchWithAuth;