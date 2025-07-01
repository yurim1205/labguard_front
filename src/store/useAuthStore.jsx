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
      const response = await fetch("/api/user/refresh", {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        console.log("Token refreshed successfully");
        return true;
      } else {
        console.error("Token refresh failed");
        get().logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
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
    
    // 14분마다 토큰 갱신 (access token이 15분이므로 1분 여유)
    const timer = setInterval(() => {
      get().refreshToken();
    }, 14 * 60 * 1000);
    
    set({ refreshTimer: timer });
  },
  
  // API 요청 시 토큰 만료 처리
  handleTokenExpiry: async () => {
    const success = await get().refreshToken();
    return success;
  }
}));