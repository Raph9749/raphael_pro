"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    async function loadUser() {
      if (user) {
        setLoading(false);
        return;
      }

      if (!isAuthenticated()) {
        setLoading(false);
        if (requireAuth) {
          router.push("/login");
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        if (requireAuth) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [user, requireAuth, router, setUser, setLoading]);

  return { user, isLoading, isAuthenticated: !!user };
}
