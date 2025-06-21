import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null, // 사용자 정보 저장
  token: localStorage.getItem('token'), // localStorage에서 토큰 복원
  
  login: (userData, token) => {
    // 토큰을 localStorage에 저장
    if (token) {
      localStorage.setItem('token', token);
    }
    
    set({ 
      isLoggedIn: true, 
      user: userData,
      token: token 
    });
  },
  
  logout: () => {
    // localStorage에서 토큰 제거
    localStorage.removeItem('token');
    
    set({ 
      isLoggedIn: false, 
      user: null,
      token: null 
    });
  },
}));