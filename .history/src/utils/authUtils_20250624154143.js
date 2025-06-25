import { useAuthStore } from "../store/useAuthStore";

// 완전한 로그아웃 함수
export const performCompleteLogout = async () => {
  try {
    console.log('🚪 완전 로그아웃 시작');
    
    // 1. 서버에 로그아웃 요청 (세션/쿠키 정리)
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        console.log('🚪 서버 로그아웃 성공');
      } else {
        console.warn('🚪 서버 로그아웃 실패:', response.status);
      }
    } catch (serverError) {
      console.error('🚪 서버 로그아웃 요청 실패:', serverError);
    }
    
    // 2. 클라이언트 상태 초기화
    useAuthStore.getState().logout();
    
    // 3. 로컬 스토리지 정리 (혹시 토큰이 저장되어 있다면)
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    } catch (storageError) {
      console.error('🚪 로컬 스토리지 정리 실패:', storageError);
    }
    
    // 4. 세션 스토리지 정리
    try {
      sessionStorage.clear();
    } catch (sessionError) {
      console.error('🚪 세션 스토리지 정리 실패:', sessionError);
    }
    
    console.log('🚪 완전 로그아웃 완료');
    
  } catch (error) {
    console.error('🚪 로그아웃 중 에러:', error);
    
    // 에러가 발생해도 클라이언트 상태는 초기화
    useAuthStore.getState().logout();
  }
};

// 토큰 만료 시 강제 로그아웃
export const forceLogoutOnTokenExpiry = async () => {
  console.log('⏰ 토큰 만료로 인한 강제 로그아웃');
  
  await performCompleteLogout();
  
  // 사용자에게 알림
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
  
  // 로그인 페이지로 이동
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

// 인증 실패 시 로그아웃
export const logoutOnAuthFailure = async (reason = '인증 실패') => {
  console.log('❌ 인증 실패로 인한 로그아웃:', reason);
  
  await performCompleteLogout();
  
  // 사용자에게 알림
  alert(`${reason}가 발생했습니다. 다시 로그인해주세요.`);
  
  // 로그인 페이지로 이동
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}; 