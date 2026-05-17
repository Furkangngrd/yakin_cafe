import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Coffee,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ═══════════════════════════════════════════════════════════
// 👑 Admin Login Page — Gizli Yönetici Giriş Portalı
//    • /admin/login rotasında erişilebilir
//    • Koyu premium tema
//    • Normal kullanıcı giriş sayfasından tamamen farklı
// ═══════════════════════════════════════════════════════════

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Zaten admin olarak giriş yapılmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Tüm alanları doldurunuz.");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);

      if (loggedUser.role !== "admin") {
        // Admin değilse oturumu kapat
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Bu portal sadece yöneticilere açıktır.");
        setLoading(false);
        return;
      }

      toast.success("Yönetici girişi başarılı! 👑", { duration: 3000 });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Giriş başarısız.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0b14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ─── Animated Background Effects ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-yellow-500/3 blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-400/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* ─── Login Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-400/90 uppercase tracking-widest">
              Yetkili Erişim Noktası
            </span>
          </div>
        </motion.div>

        {/* Card */}
        <div className="bg-[#12131f]/80 backdrop-blur-2xl rounded-3xl border border-white/[0.06] shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 relative"
            >
              <Crown className="w-8 h-8 text-white" />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 blur-xl opacity-30 -z-10" />
            </motion.div>

            <h1 className="text-2xl font-black text-white tracking-tight mb-1.5">
              Yönetici Girişi
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              YakınKafe kontrol merkezi
            </p>
          </div>

          {/* Divider */}
          <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-5">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                <Mail className="w-3.5 h-3.5" />
                E-posta
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yakinkafe.com"
                  autoComplete="email"
                  className="w-full px-4 py-3.5 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] focus:border-amber-500/40 rounded-xl text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-amber-500/10 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-orange-500/0 group-focus-within:from-amber-500/5 group-focus-within:to-orange-500/5 pointer-events-none transition-all duration-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                <Lock className="w-3.5 h-3.5" />
                Şifre
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 pr-12 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] focus:border-amber-500/40 rounded-xl text-sm text-white placeholder:text-gray-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-amber-500/10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-300 rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-orange-500/0 group-focus-within:from-amber-500/5 group-focus-within:to-orange-500/5 pointer-events-none transition-all duration-500" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Crown className="w-4.5 h-4.5" />
                  Yönetici Olarak Giriş Yap
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Coffee className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">
              YakınKafe · Yönetim Portalı
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
