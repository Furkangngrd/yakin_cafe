import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  MapPin,
  Search,
  Menu,
  X,
  LogOut,
  Plus,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ═══════════════════════════════════════════════════════════════
// 🧭 Navbar — Premium Floating Glass Navigation Bar
//    • Floating pill-style bar (NOT a static top bar)
//    • Glassmorphism background
//    • Responsive mobile drawer
//    • Search, Location, Auth integration
// ═══════════════════════════════════════════════════════════════

export default function Navbar({
  onAuthOpen,
  onFindLocation,
  onSearchChange,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ════════════════ Desktop/Tablet Floating Pill Navbar ════════════════ */}
      <nav
        className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[96%] sm:w-[92%] max-w-7xl z-50 px-3 sm:px-7 py-2 sm:py-3 bg-white/75 backdrop-blur-2xl border border-white/50 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2 sm:gap-4"
        id="main-navbar"
      >
        {/* ─── Logo ─── */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md shadow-brand-200/50 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
            <Coffee className="text-white w-[18px] h-[18px]" />
          </div>
          <span className="font-black text-lg tracking-tight text-gray-900 hidden sm:block">
            YakınKafe
          </span>
        </Link>

        {/* ─── Search Bar (Desktop) ─── */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 group-focus-within:text-brand-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Mekan veya kategori ara…"
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-11 pr-5 py-2.5 bg-gray-100/60 hover:bg-gray-100 rounded-2xl border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ─── Right Actions ─── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Konum butonu */}
          <button
            onClick={onFindLocation}
            title="Konumumu Bul"
            className="p-2 sm:p-2.5 bg-gray-100/60 hover:bg-brand-50 text-gray-500 hover:text-brand-600 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <MapPin className="w-[18px] h-[18px]" />
          </button>

          {/* Auth durumuna göre */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200/60 ml-1">
              {/* Kullanıcı bilgisi */}
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                  Hoş Geldin
                </p>
                <p className="text-sm font-bold text-gray-800 leading-tight mt-0.5">
                  {user?.name?.split(" ")[0]}
                </p>
              </div>
              {/* Avatar */}
              <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-black text-sm border border-brand-200/50">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {/* Çıkış */}
              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-200/40 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Giriş Yap
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ════════════════ Mobile Drawer ════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[200]" id="mobile-nav-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">YakınKafe</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Search (mobile) */}
              <div className="px-5 py-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mekan ara..."
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-brand-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* User info / Auth buttons */}
              <div className="flex-1 px-5 py-2 space-y-1.5 overflow-y-auto">
                {isAuthenticated ? (
                  <>
                    {/* User card */}
                    <div className="flex items-center gap-3 p-3 bg-brand-50/50 rounded-xl border border-brand-100 mb-3">
                      <div className="w-11 h-11 bg-brand-100 rounded-xl flex items-center justify-center">
                        <span className="text-base font-bold text-brand-700">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    {/* Nav links */}
                    <button
                      onClick={() => {
                        onFindLocation?.();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-brand-500" />
                      Konumumu Bul
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                    </button>

                    <div className="border-t border-gray-100 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        onAuthOpen?.();
                        setMobileOpen(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Giriş Yap / Kayıt Ol
                    </button>
                  </div>
                )}
              </div>

              {/* Footer branding */}
              <div className="px-5 py-4 border-t border-gray-100 text-center">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  YakınKafe · Kokuyu Takip Et
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
