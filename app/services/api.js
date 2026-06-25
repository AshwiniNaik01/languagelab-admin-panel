import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read token from cookies — checks editor_token first, then falls back to token
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : null;
    };
    const token = getCookie("editor_token") || getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;