import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the token cookie saved after login and attach it to every request
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    if (match) {
      config.headers.Authorization = `Bearer ${decodeURIComponent(match[1])}`;
    }
  }
  return config;
});

export default api;