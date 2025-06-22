import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null, // 사용자 정보 저장
  
  login: (userData) => {
    set({ 
      isLoggedIn: true, 
      user: userData
    });
  },
  
  logout: () => {
    set({ 
      isLoggedIn: false, 
      user: null
    });
  },
}));