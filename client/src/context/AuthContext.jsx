import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// ═══════════════════════════════════════════════════════════
// 🔐 AuthProvider — Kalıcı Oturum Yönetimi
//    • localStorage ile F5/yenileme sonrası oturum korunur
//    • Sunucu restart durumunda bile kullanıcı atılmaz
//    • /auth/me başarısız olursa localStorage'daki veri ile devam eder
// ═══════════════════════════════════════════════════════════

export function AuthProvider({ children }) {
  // İlk yükleme: localStorage'dan anında oku (sayfa yenilemede oturum korunsun)
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // ─── Başlangıçta Oturum Doğrulama (Arka Plan) ───
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!savedToken) {
        // Token yok → çıkış durumu
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      // Token var → kullanıcıyı localStorage'dan hemen yükle
      // Böylece sayfa yenilendiğinde anında giriş yapılmış görünür
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // JSON parse hatası → temizle
        }
      }
      setToken(savedToken);

      // Arka planda sunucudan kullanıcı bilgisini güncellemeye çalış
      try {
        const { data } = await api.get("/auth/me");
        if (data?.data?.user) {
          setUser(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      } catch (err) {
        // SADECE 401 (token geçersiz) durumunda oturumu kapat
        // Sunucu kapandıysa (network error) veya başka hata varsa kullanıcıyı ATMA
        if (err?.response?.status === 401) {
          console.warn("🔐 Token geçersiz, oturum kapatılıyor.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        } else {
          // Sunucu ulaşılamıyor (restart, network hatası vb.)
          // → localStorage'daki bilgilerle devam et, kullanıcıyı ATMA
          console.warn("⚠️ Sunucu ulaşılamıyor, localStorage ile devam ediliyor.");
        }
      }

      setLoading(false);
    };

    verifySession();
  }, []);

  // ─── Giriş (Login) ───
  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { user: u, token: t } = data.data;

    // localStorage'a KESİNLİKLE kaydet
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));

    setUser(u);
    setToken(t);
    return u;
  }, []);

  // ─── Kayıt (Register) ───
  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    const { user: u, token: t } = data.data;

    // localStorage'a KESİNLİKLE kaydet
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));

    setUser(u);
    setToken(t);
    return u;
  }, []);

  // ─── Çıkış (Logout) ───
  const logout = useCallback(() => {
    // localStorage'ı temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  }, []);

  // ─── Favori Toggle ───
  const toggleFavorite = useCallback(async (placeId) => {
    const { data } = await api.post(`/auth/favorites/${placeId}`);
    const updatedUser = { ...user, favorites: data.data.favorites };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return data.data;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
