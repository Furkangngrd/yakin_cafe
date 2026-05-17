import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  MapPin,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  ChevronDown,
  UtensilsCrossed,
  Layers,
  Crown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ═══════════════════════════════════════════════════════════════
// 🧭 Navbar — Premium Floating Glass Navigation Bar
//    • Floating pill-style bar (NOT a static top bar)
//    • Glassmorphism background
//    • Responsive mobile drawer
//    • 🆕 Dynamic category filter dropdown on logo button
//    • Search, Location, Auth integration
// ═══════════════════════════════════════════════════════════════

// ─── Kategori Tanımları ───
const CATEGORIES = [
  {
    id: "all",
    label: "Tüm Mekanlar",
    shortLabel: "En Yakındaki Mekanlar",
    icon: Layers,
    gradient: "from-brand-500 to-brand-700",
    activeBg: "bg-brand-50",
    activeText: "text-brand-700",
    activeBorder: "border-brand-200",
  },
  {
    id: "kahve",
    label: "Kafeler",
    shortLabel: "En Yakındaki Kafeler",
    icon: Coffee,
    gradient: "from-emerald-500 to-emerald-700",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
    activeBorder: "border-emerald-200",
  },
  {
    id: "restoran",
    label: "Restoranlar",
    shortLabel: "En Yakındaki Restoranlar",
    icon: UtensilsCrossed,
    gradient: "from-rose-500 to-rose-700",
    activeBg: "bg-rose-50",
    activeText: "text-rose-700",
    activeBorder: "border-rose-200",
  },
];

export default function Navbar({
  onAuthOpen,
  onFindLocation,
  onSearchChange,
  activeCategory = "all",
  onCategoryChange,
  onAdminOpen,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleCategorySelect = (catId) => {
    onCategoryChange?.(catId);
    setCategoryOpen(false);
  };

  // Aktif kategoriyi bul
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
  const ActiveIcon = activeCat.icon;

  return (
    <>
      {/* ════════════════ Desktop/Tablet Floating Pill Navbar ════════════════ */}
      <nav
        className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[96%] sm:w-[92%] max-w-7xl z-50 px-3 sm:px-7 py-2 sm:py-3 bg-white/75 backdrop-blur-2xl border border-white/50 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2 sm:gap-4"
        id="main-navbar"
      >
        {/* ─── Logo + Category Dropdown ─── */}
        <div className="relative flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0" ref={dropdownRef}>
          {/* Category Toggle Button (Logo görünümlü) */}
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className={`flex items-center gap-1.5 sm:gap-2.5 group transition-all duration-300`}
          >
            <div className={`w-9 h-9 bg-gradient-to-br ${activeCat.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
              <ActiveIcon className="text-white w-[18px] h-[18px]" />
            </div>
            {/* Dinamik metin — mobilde kısa, masaüstünde uzun */}
            <div className="flex items-center gap-1">
              <span className="font-black text-xs sm:text-sm tracking-tight text-gray-900 whitespace-nowrap max-w-[120px] sm:max-w-none truncate">
                {activeCat.shortLabel}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                  categoryOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* ─── Category Dropdown Menu ─── */}
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-[100]"
              >
                <div className="p-1.5">
                  <p className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Kategori Filtrele
                  </p>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? `${cat.activeBg} ${cat.activeText} ${cat.activeBorder} border`
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? `bg-gradient-to-br ${cat.gradient} text-white shadow-sm`
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{cat.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="category-check"
                            className="ml-auto w-2 h-2 rounded-full bg-current"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
              {/* 👑 Admin Panel Butonu — Sadece admin rolüne sahip kullanıcılara gösterilir */}
              {user?.role === "admin" && (
                <button
                  onClick={onAdminOpen}
                  title="Mekan Ekleme İstekleri"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-200/40 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Crown className="w-3.5 h-3.5" />
                  İstekler
                </button>
              )}
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

              {/* 🆕 Category Filter (Mobile Drawer) */}
              <div className="px-5 py-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Kategori
                </p>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleCategorySelect(cat.id);
                          setMobileOpen(false);
                        }}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? `${cat.activeBg} ${cat.activeText} ${cat.activeBorder} border shadow-sm`
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive
                              ? `bg-gradient-to-br ${cat.gradient} text-white`
                              : "bg-gray-200/60 text-gray-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
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

                    {/* 👑 Mekan Ekleme İstekleri — Mobil Drawer */}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => {
                          onAdminOpen?.();
                          setMobileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Crown className="w-4 h-4 text-amber-500" />
                        Mekan Ekleme İstekleri
                        <ChevronRight className="w-4 h-4 text-amber-300 ml-auto" />
                      </button>
                    )}

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
