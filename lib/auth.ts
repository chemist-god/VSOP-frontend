import type { AuthUser } from "@/lib/types/auth";

const ACCESS_TOKEN_KEY = "vsop_access_token";
const REFRESH_TOKEN_KEY = "vsop_refresh_token";
const USER_KEY = "vsop_user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Merge a partial update (e.g. an onboarding resume-point response) into the
 * stored user without touching tokens. Returns the merged user, or null if
 * there's nothing stored yet.
 */
export function updateStoredUser(patch: Partial<AuthUser>): AuthUser | null {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  if (isBrowser()) {
    localStorage.setItem(USER_KEY, JSON.stringify(next));
  }
  return next;
}

/** Replace the stored user wholesale, e.g. with the AuthUser returned by accept-terms. */
export function replaceStoredUser(user: AuthUser): void {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
