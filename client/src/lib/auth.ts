/**
 * Auth utility functions
 * Client-side authentication helpers
 */

// Custom event for auth changes
export const AUTH_CHANGE_EVENT = 'auth:change';

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window === "undefined") return;
  // Clear ALL authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rememberEmail");
  localStorage.removeItem("intendedRoute");
  // Dispatch auth change event
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user: null } }));
}

export function setLoginData(token: string, user: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  // Dispatch auth change event
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user } }));
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.clear();
  sessionStorage.clear();
  // Dispatch auth change event
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { user: null } }));
}
