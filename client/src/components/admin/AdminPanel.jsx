import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  User,
  Coffee,
  UtensilsCrossed,
  Cake,
  Laptop,
  Home,
  Star,
  Loader2,
  Inbox,
  Shield,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// ═══════════════════════════════════════════════════════════
// 👑 Admin Panel — Mekan Onay Dashboard
//    • Onay bekleyen mekanları listeler
//    • ✅ Onayla / ❌ Reddet butonları
//    • Premium glassmorphism modal tasarım
// ═══════════════════════════════════════════════════════════

const CATEGORY_META = {
  kahve: { icon: Coffee, emoji: "☕", label: "Kahve", color: "emerald" },
  tatli: { icon: Cake, emoji: "🍰", label: "Tatlı", color: "pink" },
  restoran: { icon: UtensilsCrossed, emoji: "🍽️", label: "Restoran", color: "rose" },
  "calisma-alani": { icon: Laptop, emoji: "💻", label: "Çalışma", color: "indigo" },
  diger: { icon: Home, emoji: "📍", label: "Diğer", color: "gray" },
};

export default function AdminPanel({ isOpen, onClose }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // id of place being actioned

  // ─── Onay bekleyen mekanları getir ───
  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/cafes/pending");
      setPlaces(data.data?.places || []);
    } catch (err) {
      console.error("Admin panel veri hatası:", err);
      toast.error("Onay bekleyen mekanlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPending();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, fetchPending]);

  // ESC ile kapat
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // ─── Onayla ───
  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/cafes/${id}/approve`);
      toast.success("Mekan onaylandı ve haritaya eklendi! ✅", { duration: 3000 });
      setPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Onaylama işlemi başarısız.");
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Reddet ───
  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/cafes/${id}/reject`);
      toast.success("Mekan reddedildi. ❌", { duration: 3000 });
      setPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Reddetme işlemi başarısız.");
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Zaman formatla ───
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000); // dakika
    if (diff < 1) return "Az önce";
    if (diff < 60) return `${diff} dk önce`;
    if (diff < 1440) return `${Math.floor(diff / 60)} saat önce`;
    return `${Math.floor(diff / 1440)} gün önce`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" id="admin-panel-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* ─── Header ─── */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">
                      Admin Paneli
                    </h2>
                    <p className="text-amber-100 text-xs mt-0.5 font-medium">
                      Mekan onay yönetimi
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/15 rounded-xl transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dekoratif dalga */}
              <div className="absolute -bottom-[1px] left-0 right-0 overflow-hidden">
                <svg
                  viewBox="0 0 400 12"
                  className="w-full h-3 text-white"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 12 C100 0, 200 12, 300 4 C350 0, 380 8, 400 12 L400 12 L0 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* ─── İstatistik Bar ─── */}
            <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-100/60 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-800">
                  Onay Bekleyen
                </span>
              </div>
              <span className="text-xs font-black bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full uppercase tracking-wider">
                {places.length} Mekan
              </span>
            </div>

            {/* ─── İçerik ─── */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-sm text-gray-400 font-medium">Yükleniyor...</p>
                </div>
              ) : places.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <Inbox className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-700">
                      Tüm mekanlar onaylandı! 🎉
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Onay bekleyen mekan bulunmuyor.
                    </p>
                  </div>
                </div>
              ) : (
                places.map((place, idx) => {
                  const catMeta = CATEGORY_META[place.category] || CATEGORY_META.diger;
                  const isActioning = actionLoading === place._id;

                  return (
                    <motion.div
                      key={place._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                        isActioning ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {/* Mekan Bilgileri */}
                      <div className="p-4">
                        {/* Üst satır: Kategori + Zaman */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-${catMeta.color}-50 text-${catMeta.color}-700`}>
                            <span>{catMeta.emoji}</span>
                            {catMeta.label}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatTime(place.createdAt)}
                          </span>
                        </div>

                        {/* Mekan Adı */}
                        <h3 className="text-base font-black text-gray-900 mb-1.5 leading-tight">
                          {place.name}
                        </h3>

                        {/* Açıklama */}
                        {place.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {place.description}
                          </p>
                        )}

                        {/* Meta bilgiler */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          {/* Koordinat */}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-500" />
                            {place.location?.coordinates?.[1]?.toFixed(4)},{" "}
                            {place.location?.coordinates?.[0]?.toFixed(4)}
                          </span>

                          {/* Puan */}
                          {place.averageRating > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {place.averageRating}
                            </span>
                          )}

                          {/* Ekleyen */}
                          {place.createdBy && (
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-400" />
                              {place.createdBy.name || place.createdBy.email || "Bilinmiyor"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ─── Aksiyon Butonları ─── */}
                      <div className="flex border-t border-gray-50">
                        <button
                          onClick={() => handleApprove(place._id)}
                          disabled={isActioning}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-green-600 hover:bg-green-50 transition-all duration-200 hover:text-green-700 active:scale-[0.98]"
                        >
                          {isActioning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4.5 h-4.5" />
                          )}
                          Onayla
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleReject(place._id)}
                          disabled={isActioning}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 hover:text-red-600 active:scale-[0.98]"
                        >
                          {isActioning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4.5 h-4.5" />
                          )}
                          Reddet
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* ─── Footer ─── */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all duration-200"
              >
                Paneli Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
