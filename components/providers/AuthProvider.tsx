"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return children;
};

export default AuthProvider;
