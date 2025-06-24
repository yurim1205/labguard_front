import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null, // 사용자 정보 저장
  token: null, // JWT 토큰 저장
  
  login: (userData, userToken = null) => {
    set({ 
      isLoggedIn: true, 
      user: userData,
      token: userToken
    });
  },
  
  logout: () => {
    set({ 
      isLoggedIn: false, 
      user: null,
      token: null
    });
  },
}));