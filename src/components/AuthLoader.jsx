// src/components/AuthLoader.jsx
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const AuthLoader = () => {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          login({
            name: userData.name,
            email: userData.email,
            company_id: userData.company_id,
          });
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    checkAuth();
  }, []);

  return null;
};

export default AuthLoader;
