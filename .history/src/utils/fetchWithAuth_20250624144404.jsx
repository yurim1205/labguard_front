import { useAuthStore } from "../store/useAuthStore";

export const fetchWithTokenRetry = async (url, options = {}) => {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    // 액세스 토큰 만료 → 새로 받기
    const refreshRes = await fetch("/api/token/refresh", {
      method: "POST",
      credentials: "include", // HttpOnly 쿠키 사용
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newToken = data.access_token;

      // Zustand 상태 갱신
      useAuthStore.getState().login(useAuthStore.getState().user, newToken);

      // 원래 요청 재시도
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      });
    } else {
      // 재발급 실패 시 로그아웃
      useAuthStore.getState().logout();
    }
  }

  return res;
};
