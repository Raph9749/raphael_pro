"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { getMockCurrentUser } from "@/lib/mock-auth";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { user, setUser, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const storedUser = getMockCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      setLoading(false);
      if (requireAuth) {
        router.push("/login");
      }
    }
  }, [user, requireAuth, router, setUser, setLoading]);

  return { user, isLoading, isAuthenticated: !!user };
}
