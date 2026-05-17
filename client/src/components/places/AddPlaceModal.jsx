import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Star,
  Coffee,
  UtensilsCrossed,
  Cake,
  Laptop,
  Home,
  CheckCircle,
  Sparkles,
  DollarSign,
  FileText,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// ═══════════════════════════════════════════════════════════
// 📍 Mekan Ekle Modal — Premium Slide-in Drawer
//    • Haritaya tıklayınca açılır
//    • Kategori, Puan, Fiyat Skalası alanları
//    • MongoDB GeoJSON Point formatında POST
// ═══════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: "kahve", label: "Kahve", icon: Coffee, emoji: "☕" },
  { id: "tatli", label: "Tatlı", icon: Cake, emoji: "🍰" },
  { id: "restoran", label: "Restoran", icon: UtensilsCrossed, emoji: "🍽️" },
  { id: "calisma-alani", label: "Çalışma Alanı", icon: Laptop, emoji: "💻" },
  { id: "diger", label: "Diğer", icon: Home, emoji: "📍" },
];

const PRICE_LABELS = ["", "₺", "₺₺", "₺₺₺", "₺₺₺₺"];
const PRICE_DESCRIPTIONS = [
  "",
  "Uygun fiyatlı",
  "Orta seviye",
  "Pahalı",
  "Lüks",
];

export default function AddPlaceModal({
  isOpen,
  onClose,
  coordinates,
  editData,
  onSuccess,
}) {
  const isEditing = !!editData;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("kahve");
  const [rating, setRating] = useState(4);
  const [priceLevel, setPriceLevel] = useState(2);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Açılışta sıfırla veya editData ile doldur + scroll kilit
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setName(editData.name || "");
        setCategory(editData.category || "kahve");
        setRating(editData.averageRating || 4);
        setPriceLevel(editData.priceLevel || 2);
        setDescription(editData.description || "");
      } else {
        setName("");
        setCategory("kahve");
        setRating(4);
        setPriceLevel(2);
        setDescription("");
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, editData]);

  // Mevcut koordinatları bul
  const currentCoords = coordinates || (editData && editData.location?.coordinates ? {
    lat: editData.location.coordinates[1],
    lng: editData.location.coordinates[0]
  } : null);

  // ESC ile kapat
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Lütfen mekan adını girin.");
      return;
    }
    if (!currentCoords) {
      toast.error("Konum bilgisi eksik.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        category,
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        priceLevel,
        averageRating: rating,
        description: description.trim(),
      };

      if (isEditing) {
        await api.put(`/places/${editData._id}`, payload);
        toast.success("Mekan başarıyla güncellendi! 🎉", {
          icon: "✏️",
          duration: 3000,
        });
      } else {
        await api.post("/places", payload);
        toast.success("Mekan onaya gönderildi. Admin onayladıktan sonra haritada görünecek! ⏳", {
          icon: "📋",
          duration: 4000,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.error || "Mekan eklenirken bir hata oluştu.";
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

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", damping: 28, stiffness: 260 },
    },
    exit: {
      x: "100%",
      transition: { type: "spring", damping: 32, stiffness: 300 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999]"
          id="add-place-modal-overlay"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col z-[10000]"
            id="add-place-drawer"
          >
            {/* ─── Header ─── */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-brand-600 to-brand-700 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      {isEditing ? "Mekanı Düzenle" : "Yeni Mekan Ekle"}
                    </h2>
                    <p className="text-brand-100 text-xs mt-0.5">
                      {isEditing ? "Mekan bilgilerini güncelle" : "Haritadaki noktayı özelleştir"}
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

            {/* ─── Form ─── */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              {/* Koordinat Badge */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="p-2.5 bg-brand-100 rounded-xl text-brand-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Seçilen Konum
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-700 truncate">
                    {currentCoords?.lat?.toFixed(5)},{" "}
                    {currentCoords?.lng?.toFixed(5)}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse flex-shrink-0" />
              </div>

              {/* Mekan Adı */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Mekan Adı
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Tatvan Sahil Kahvesi"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                  <Coffee className="w-3.5 h-3.5 text-brand-500" />
                  Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-brand-50 border-brand-400 text-brand-700 shadow-sm shadow-brand-100"
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span>{cat.label}</span>
                        {isActive && (
                          <CheckCircle className="w-3.5 h-3.5 text-brand-500 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Puan & Fiyat Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Puan */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Puan
                  </label>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors duration-150 ${
                            s <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    {rating}/5 yıldız
                  </p>
                </div>

                {/* Fiyat Skalası */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                    Fiyat
                  </label>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                    {[1, 2, 3, 4].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriceLevel(p)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                          priceLevel === p
                            ? "bg-white text-brand-600 shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {PRICE_LABELS[p]}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    {PRICE_DESCRIPTIONS[priceLevel]}
                  </p>
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                  <FileText className="w-3.5 h-3.5 text-brand-500" />
                  Kısa Açıklama
                  <span className="text-gray-400 font-normal ml-1">
                    (opsiyonel)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mekan hakkında kısa bir not bırakın..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 outline-none transition-all resize-none text-sm placeholder:text-gray-400"
                />
              </div>
            </form>

            {/* ─── Footer ─── */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/80 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-100 transition-all"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !name.trim()}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-200/40 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4.5 h-4.5" />
                      {isEditing ? "Değişiklikleri Kaydet" : "Mekanı Kaydet"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
