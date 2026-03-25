import api from "./api";
import type { User, LoginCredentials, AuthTokens } from "@/types";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
  const response = await api.post<{ user: User; tokens: AuthTokens }>("/auth/login/", credentials);
  setTokens(response.tokens);
  return response;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await api.post("/auth/logout/", { refresh: refreshToken });
    }
  } finally {
    clearTokens();
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await api.post<{ access: string }>("/auth/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem(TOKEN_KEY, response.access);
    return response.access;
  } catch {
    clearTokens();
    return null;
  }
}

export async function getCurrentUser(): Promise<User> {
  return api.get<User>("/auth/me/");
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post("/auth/password-reset/", { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post("/auth/password-reset/confirm/", { token, password });
}
