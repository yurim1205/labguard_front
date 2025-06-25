import { useAuthStore } from "../store/useAuthStore";

// 간단한 fetch 래퍼 - 401 에러 시 로그아웃만 처리
export const fetchWithAuth = async (url, options = {}) => {
  console.log('🌐 API 요청:', url);
  
  const response = await fetch(url, { 
    ...options, 
    credentials: "include" 
  });
  
  console.log('🌐 API 응답:', response.status);

  // 401 에러 시 로그아웃 처리
  if (response.status === 401) {
    console.log('🔒 인증 실패 - 로그아웃 처리');
    
    useAuthStore.getState().logout();
    
    if (typeof window !== 'undefined') {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
    }
  }

  return response;
};

// 기존 이름과의 호환성을 위해 별칭 제공
export const fetchWithTokenRetry = fetchWithAuth;