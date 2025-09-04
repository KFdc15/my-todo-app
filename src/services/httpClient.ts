import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:3000', // chỉnh nếu backend có /api
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
});

http.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

http.interceptors.response.use(
  r => r,
  e => Promise.reject(e)
);