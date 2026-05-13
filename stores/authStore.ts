import { create } from "zustand";
import { LoginDto } from "@/types/auth";
import { AuthUserDto } from "@/types/user";
import { loginUser, logoutUser, refreshToken } from "@/lib/api/auth";

type AuthState = {
  user: AuthUserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (data) => {
    const res = await loginUser(data);

    set({
      user: res.user,
      accessToken: res.accessToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await logoutUser();

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  initAuth: async () => {
    try {
      const res = await refreshToken();

      set({
        user: res.user,
        accessToken: res.accessToken,
        isAuthenticated: true,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
