import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Sunucu restart durumlarında bekleme süresi
  timeout: 10000,
});

// Request interceptor — JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // SADECE kesin 401 yanıtı geldiğinde token'ı sil
    // Network hatası, timeout, sunucu kapalı durumlarında token'a DOKUNMA
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
