import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Coffee,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// ☕ AuthModal — Kahve Temalı Glassmorphism Giriş / Kayıt
// ═══════════════════════════════════════════════════════════
export default function AuthModal({ isOpen, onClose, hideClose = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Body scroll kilit
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC ile kapatma
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Tab değiştiğinde formu sıfırla
  const switchTab = useCallback(
    (loginMode) => {
      setIsLogin(loginMode);
      setFormData({ name: "", email: "", password: "" });
      setShowPassword(false);
    },
    []
  );

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!email || !password || (!isLogin && !name)) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Hoş geldin! Kokuyu takip et… ☕");
      } else {
        await register(name, email, password);
        toast.success("Aramıza hoş geldin! 🎉");
      }
      onClose(true); // success flag
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (isLogin ? "Giriş bilgilerini kontrol et." : "Kayıt başarısız.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Framer Motion Variants ───
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 28, stiffness: 320, delay: 0.1 },
    },
    exit: {
      opacity: 0,
      y: 40,
      scale: 0.92,
      transition: { duration: 0.2 },
    },
  };

  // ─── Input helper ───
  const inputCls =
    "w-full pl-12 pr-12 py-4 bg-white/60 border border-white/70 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-400 transition-all duration-200 font-medium backdrop-blur-sm";

  const labelCls =
    "block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1";

  const iconCls =
    "absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none";

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Tam Ekran Kapsayıcı ── */
        <div
          className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4"
          id="auth-modal-overlay"
        >
          {/* ☕ Kahve Temalı Arka Plan Görseli + Blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1920')] bg-cover bg-center"
          >
            {/* Koyu blur katmanı */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/50" />
            {/* Sıcak kahve gradyanı */}
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/30 via-transparent to-coffee-800/20" />
          </motion.div>

          {/* 🧊 Glassmorphism Form Kartı */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white/85 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] p-8 mx-4 flex flex-col gap-5"
            id="auth-modal-card"
          >
            {/* ✕ Kapat Butonu */}
            {!hideClose && (
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/5 hover:bg-black/10 text-gray-500 hover:text-gray-800 transition-all duration-200 z-10"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* ─── Logo & Slogan ─── */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-brand-200/50 mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                YakınKafe
              </h1>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coffee-500" />
                <p className="text-xs font-bold text-coffee-600 uppercase tracking-[0.2em]">
                  Kokuyu Takip Et
                </p>
                <Sparkles className="w-3.5 h-3.5 text-coffee-500" />
              </div>
            </div>

            {/* ─── Tab Switcher ─── */}
            <div className="flex bg-black/[0.06] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => switchTab(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  isLogin
                    ? "bg-white shadow-sm text-brand-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => switchTab(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  !isLogin
                    ? "bg-white shadow-sm text-brand-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* ─── Form ─── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              {/* Ad Soyad (sadece Kayıt) */}
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <label className={labelCls}>Ad Soyad</label>
                    <div className="relative">
                      <User className={iconCls} />
                      <input
                        type="text"
                        required={!isLogin}
                        placeholder="Örn: Ahmet Yılmaz"
                        value={formData.name}
                        onChange={handleChange("name")}
                        className={inputCls}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* E-Posta */}
              <div>
                <label className={labelCls}>E-Posta Adresi</label>
                <div className="relative">
                  <Mail className={iconCls} />
                  <input
                    type="email"
                    required
                    placeholder="kahve@kafe.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className={labelCls}>Şifre</label>
                <div className="relative">
                  <Lock className={iconCls} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange("password")}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-200/40 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Giriş Yap" : "Hemen Kaydol"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo hesap (giriş sekmesinde) */}
            {isLogin && (
              <div className="bg-brand-50/60 border border-brand-100 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">
                  Demo Hesap
                </p>
                <p className="text-[11px] text-brand-500 font-mono">
                  demo@test.com / password123
                </p>
              </div>
            )}

            {/* Alt link */}
            {!hideClose && (
              <button
                type="button"
                onClick={() => onClose()}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Şimdilik Atla →
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
