import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  refreshTimer: null,
  
  login: (userData) => {
    set({ 
      isLoggedIn: true, 
      user: userData
    });
    
    // 로그인 후 자동 토큰 갱신 시작
    get().startTokenRefresh();
  },
  
  logout: async () => {
    // 로그아웃 API 호출
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    // 타이머 정리
    const { refreshTimer } = get();
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    
    set({ 
      isLoggedIn: false, 
      user: null,
      refreshTimer: null
    });
  },
  
  // 토큰 갱신 함수
  refreshToken: async () => {
    try {
      console.log("토큰 갱신 시도...");
      
      const response = await fetch("/api/user/refresh", {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        console.log("토큰 갱신 성공");
        return true;
      } else {
        console.error("토큰 갱신 실패:", response.status);
        get().logout();
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 오류:", error);
      get().logout();
      return false;
    }
  },
  
  // 자동 토큰 갱신 시작
  startTokenRefresh: () => {
    const { refreshTimer } = get();
    
    // 이미 타이머가 실행 중이면 정리
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    
    console.log("자동 토큰 갱신 시작 (12분마다)");
    
    // 12분마다 토큰 갱신 (access token이 15분이므로 3분 여유)
    const timer = setInterval(() => {
      console.log("토큰 갱신 스케줄 실행");
      get().refreshToken();
    }, 12 * 60 * 1000); // 12분
    
    set({ refreshTimer: timer });
  },
  
  // API 요청 시 토큰 만료 처리
  handleTokenExpiry: async () => {
    const success = await get().refreshToken();
    return success;
  },
  
  // 페이지 로드 시 로그인 상태 확인
  checkAuthStatus: async () => {
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include"
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log("기존 로그인 상태 확인됨:", userData);
        
        set({ 
          isLoggedIn: true, 
          user: userData
        });
        
        get().startTokenRefresh();
        return true;
      } else {
        console.log("로그인되지 않은 상태");
        return false;
      }
    } catch (error) {
      console.error("로그인 상태 확인 오류:", error);
      return false;
    }
  }
}));