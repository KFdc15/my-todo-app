import { http } from './httpClient';

export interface User {
  id: number;
  username: string;
}

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export async function register(payload: { username: string; password: string }): Promise<User> {
  // Backend giả định trả về { id, username }
  const { data } = await http.post<User>('/auth/register', payload);
  localStorage.setItem(USER_KEY, JSON.stringify(data)); // chỉ lưu user (chưa token)
  return data;
}

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  // Backend giả định trả về { token, user }
  const { data } = await http.post<{ token: string; user: User }>('/auth/login', { username, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event('auth-changed'));
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('auth-changed'));
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}