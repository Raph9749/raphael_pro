import { create } from "zustand";
import type { User } from "@/types";
import { getMockCurrentUser, mockLogout } from "@/lib/mock-auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  loadUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  loadUser: () => {
    const user = getMockCurrentUser();
    set({ user, isLoading: false });
  },
  logout: () => {
    mockLogout();
    set({ user: null, isLoading: false });
  },
}));
