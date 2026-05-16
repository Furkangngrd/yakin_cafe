import { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Coffee,
  Cake,
  Laptop,
  UtensilsCrossed,
  Star,
  Compass,
  Sparkles,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MapView from "../components/map/MapView";
import PlaceList from "../components/places/PlaceList";
import AddPlaceModal from "../components/places/AddPlaceModal";
import AuthModal from "../components/auth/AuthModal";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

// ═══════════════════════════════════════════════════════════
// 🏠 HomePage — Ana Sayfa Orkestratör
//    • Navbar (floating glass)
//    • AuthModal (glassmorphism kahve temalı)
//    • MapView (flyTo + radar pulse)
//    • AddPlaceModal (slide-in drawer)
//    • Sol panel mekan listesi
// ═══════════════════════════════════════════════════════════

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  // 🗺️ Harita & Mekan durumları
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [position, setPosition] = useState(null);
  const [isFlying, setIsFlying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 📍 Manuel mekan ekleme & düzenleme
  const [tempMarker, setTempMarker] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editPlaceData, setEditPlaceData] = useState(null);

  // 🔐 Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ═══════════════════════════════════
  // 📡 API — Yakındaki mekanları getir
  // ═══════════════════════════════════
  const fetchNearbyPlaces = useCallback(async (coords) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/places/nearby?lat=${coords.lat}&lng=${coords.lng}&maxDistance=15`
      );
      const list = data.data?.places || [];
      // Normalize images
      const normalized = list.map((p) => ({
        ...p,
        image: p.image || (p.images && p.images[0]) || null,
      }));
      setPlaces(normalized);
      setFilteredPlaces(normalized);
    } catch (err) {
      console.error("API Hatası:", err);
      // API erişilemezse boş liste
      setPlaces([]);
      setFilteredPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ═══════════════════════════════════
  // 🌍 Geolocation — Konum bul & FlyTo
  // ═══════════════════════════════════
  const findMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    setIsFlying(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPos);
        fetchNearbyPlaces(newPos);
        toast.success("Konumunuz bulundu! 📍", { icon: "🧭" });
      },
      () => {
        toast("Konum izni verilmedi, BEÜ Kampüs'ten devam ediliyor.", { icon: "🏫" });
        const fallback = { lat: 38.4715, lng: 42.1592 };
        setPosition(fallback);
        fetchNearbyPlaces(fallback);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [fetchNearbyPlaces]);

  // ═══════════════════════════════════
  // 🚀 İlk yükleme — Giriş sonrası gerçek konum dene, bulamazsan BEÜ'ye düş
  // ═══════════════════════════════════
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const BEU_CAMPUS = { lat: 38.4715, lng: 42.1592 };
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    // 🎓 SUNUM HİLESİ: localhost'ta doğrudan BEÜ Kampüs'ten başla
    if (isLocalhost) {
      setIsFlying(true);
      setPosition(BEU_CAMPUS);
      fetchNearbyPlaces(BEU_CAMPUS);
      toast("📍 BEÜ Kampüs konumundan başlıyoruz", { icon: "🏫" });
      return;
    }

    // Production: gerçek konum dene
    if (navigator.geolocation) {
      setIsFlying(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const realPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(realPos);
          fetchNearbyPlaces(realPos);
          toast.success("Gerçek konumunuz bulundu! 📍", { icon: "🧭" });
        },
        () => {
          // Konum izni verilmedi → BEÜ Kampüs fallback
          setPosition(BEU_CAMPUS);
          fetchNearbyPlaces(BEU_CAMPUS);
          toast("Konum izni verilmedi, BEÜ Kampüs'ten başlıyoruz.", { icon: "🏫" });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      // Tarayıcı desteklemiyor → BEÜ Kampüs fallback
      setPosition(BEU_CAMPUS);
      fetchNearbyPlaces(BEU_CAMPUS);
    }
  }, [isAuthenticated, fetchNearbyPlaces]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);

  // ═══════════════════════════════════
  // ❤️ Favorilerim Sistemi
  // ═══════════════════════════════════
  const handleFavoriteToggle = useCallback((placeId) => {
    setFavorites((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  }, []);

  // ═══════════════════════════════════
  // 🔍 Arama & Kategori filtresi
  // ═══════════════════════════════════
  useEffect(() => {
    let result = places;

    // 1. Kategori Filtresi
    if (activeCategory === "favorites") {
      result = result.filter((p) => favorites.includes(p._id));
    } else if (activeCategory === "added") {
      result = result.filter((p) => p.isUserAdded);
    } else if (activeCategory === "kahve") {
      result = result.filter((p) => p.category === "kahve" || p.category === "kafe" || p.category === "cafe");
    } else if (activeCategory === "restoran") {
      result = result.filter((p) => p.category === "restoran" || p.category === "restaurant");
    } else if (activeCategory !== "all") {
      result = result.filter((p) => p.category?.toLowerCase() === activeCategory);
    }

    // 2. Metin Arama Filtresi
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    setFilteredPlaces(result);
  }, [searchQuery, activeCategory, places]);

  // ═══════════════════════════════════
  // 🗺️ Haritaya tıklama → Mekan ekleme
  // ═══════════════════════════════════
  const handleMapClick = useCallback(
    (latlng) => {
      // Ekleme modu kapalıysa → seçimi sıfırla (boş yere tıklandı)
      if (!isAddMode) {
        setSelectedPlace(null);
        return;
      }
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        toast.error("Mekan eklemek için lütfen giriş yapın.");
        return;
      }
      setTempMarker(latlng);
      setIsAddModalOpen(true);
      setIsAddMode(false);
    },
    [isAuthenticated, isAddMode]
  );

  // ═══════════════════════════════════
  // 🔐 Auth modal kapanış callback
  // ═══════════════════════════════════
  const handleAuthClose = useCallback(
    (success) => {
      setIsAuthModalOpen(false);
      if (success) {
        // Giriş başarılı → konum bul ve haritayı uçur
        setTimeout(() => findMyLocation(), 800);
      }
    },
    [findMyLocation]
  );

  // ═══════════════════════════════════
  // 📋 Mekan seçimi → Haritada zoom
  // ═══════════════════════════════════
  const handlePlaceSelect = useCallback((place) => {
    setSelectedPlace(place);
    const coords = place.location?.coordinates;
    if (coords) {
      setPosition({ lat: coords[1], lng: coords[0] });
      setIsFlying(true);
    }
  }, []);

  // ═══════════════════════════════════
  // ✈️ Harita uçuşu bittiğinde isFlying'ı sıfırla
  // ═══════════════════════════════════
  const handleFlyEnd = useCallback(() => {
    setIsFlying(false);
  }, []);

  // ═══════════════════════════════════
  // ✏️ Mekan Düzenleme ve Silme
  // ═══════════════════════════════════
  const handleEdit = useCallback((place) => {
    setEditPlaceData(place);
    setIsAddModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (placeId) => {
    try {
      await api.delete(`/places/${placeId}`);
      toast.success("Mekan başarıyla silindi.", { icon: "🗑️" });
      if (position) fetchNearbyPlaces(position);
      if (selectedPlace && selectedPlace._id === placeId) {
        setSelectedPlace(null);
      }
    } catch (err) {
      toast.error("Mekan silinirken hata oluştu.");
    }
  }, [position, fetchNearbyPlaces, selectedPlace]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f8fafc] overflow-hidden">
      {/* 🧭 Premium Floating Navbar */}
      <Navbar
        onAuthOpen={() => setIsAuthModalOpen(true)}
        onFindLocation={findMyLocation}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* ═══════════ Ana İçerik ═══════════ */}
      <div className="flex-1 flex pt-[64px] sm:pt-[76px] px-2 sm:px-6 pb-2 sm:pb-6 gap-2 sm:gap-6 h-full overflow-hidden">
        {/* ─── Sol Panel: Mekan Listesi (Sadece Giriş Yapılmışsa) ─── */}
        {isAuthenticated && (
          <div className="hidden md:flex w-[380px] lg:w-[420px] flex-col h-full gap-3 flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Başlık */}
            <div className="flex items-center justify-between px-1 mb-2">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  Yakınındakiler
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {position
                    ? `${position.lat.toFixed(3)}, ${position.lng.toFixed(3)} çevresinde`
                    : "Konum aranıyor…"}
                </p>
              </div>
              <span className="text-[10px] font-black bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {filteredPlaces.length} Mekan
              </span>
            </div>

            {/* Arama Input (Eğer varsa - şimdilik sadece title altı boşluk bırakıyorum, search navbar'da) */}

            {/* Accordion Listesi */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide flex flex-col gap-3 pb-20">
              {/* Seçili Mekan Görünümü */}
              <AnimatePresence mode="popLayout">
                {selectedPlace && (
                  <motion.div
                    key="selected-place"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-between px-2 mb-3">
                      <p className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Seçili Mekan
                      </p>
                      <button
                        onClick={() => setSelectedPlace(null)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md"
                      >
                        <X className="w-3 h-3" /> Tümünü Göster
                      </button>
                    </div>
                    <PlaceList
                      places={[selectedPlace]}
                      loading={false}
                      onSelect={handlePlaceSelect}
                      selectedPlace={selectedPlace}
                      favorites={favorites}
                      onFavorite={handleFavoriteToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gruplar */}
              {!selectedPlace &&
                [
                  {
                    id: "kahve",
                    label: "☕ Kafeler",
                    color: "text-emerald-700",
                    bg: "bg-emerald-50",
                    items: places.filter((p) => p.category === "kahve" || p.category === "kafe" || p.category === "cafe"),
                  },
                  {
                    id: "restoran",
                    label: "🍔 Restoranlar",
                    color: "text-rose-700",
                    bg: "bg-rose-50",
                    items: places.filter((p) => p.category === "restoran" || p.category === "restaurant"),
                  },
                  {
                    id: "favorites",
                    label: "🌟 Favorilerim",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    items: places.filter((p) => favorites.includes(p._id)),
                  },
                  {
                    id: "added",
                    label: "📍 Eklenen Mekanlar",
                    color: "text-indigo-700",
                    bg: "bg-indigo-50",
                    items: places.filter((p) => p.isUserAdded),
                  },
                ].map((group) => {
                  const isOpen = activeCategory === group.id;

                  return (
                    <div
                      key={group.id}
                      className={`rounded-2xl transition-all duration-300 ${
                        isOpen ? "bg-white shadow-xl shadow-gray-200/50 border border-gray-100" : "bg-white/60 border border-transparent hover:bg-white/80"
                      }`}
                    >
                      <button
                        onClick={() => setActiveCategory(isOpen ? "all" : group.id)}
                        className="w-full flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${group.bg}`}>
                            {group.label.split(" ")[0]}
                          </div>
                          <span className={`font-black tracking-tight ${isOpen ? "text-gray-900" : "text-gray-600"}`}>
                            {group.label.substring(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isOpen ? group.bg + " " + group.color : "bg-gray-100 text-gray-500"}`}>
                            {group.items.length}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-2 pt-0">
                              <PlaceList
                                places={filteredPlaces}
                                loading={loading}
                                onSelect={handlePlaceSelect}
                                selectedPlace={selectedPlace}
                                favorites={favorites}
                                onFavorite={handleFavoriteToggle}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ─── Sağ Panel: Harita ─── */}
        <div className="flex-1 bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100/80 relative">
          <MapView
            center={isAuthenticated ? position : null}
            places={isAuthenticated ? filteredPlaces : []}
            radius={15000}
            isFlying={isFlying}
            onPlaceSelect={handlePlaceSelect}
            selectedPlace={selectedPlace}
            onMapClick={handleMapClick}
            onFlyEnd={handleFlyEnd}
            tempMarker={tempMarker}
            isAddMode={isAddMode}
          />

          {/* 🔘 Sağ Alt: Mekan Ekleme Toggle Butonu */}
          {isAuthenticated && (
            <div className="absolute bottom-20 sm:bottom-6 right-4 sm:right-6 z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setIsAddMode(!isAddMode)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isAddMode 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30" 
                  : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-brand-500/40"
              }`}
            >
              {isAddMode ? (
                <>
                  <X className="w-5 h-5" />
                  İptal Et
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Mekan Ekle
                </>
              )}
            </button>
          </div>
          )}

          {/* 💡 Yüzen yardım baloncuğu (Sadece AddMode aktifken) */}
          {!tempMarker && isAuthenticated && isAddMode && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 animate-gentle-bounce pointer-events-none">
              <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-brand-600 w-3.5 h-3.5 fill-brand-600" />
              </div>
              <p className="text-xs font-bold text-gray-700 whitespace-nowrap">
                Eklemek istediğiniz konumu haritada seçin
              </p>
            </div>
          )}

          {/* 🚀 Giriş yapmamış kullanıcı için CTA */}
          {!isAuthenticated && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-brand-200/40 flex items-center gap-2.5 text-sm font-bold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto"
              >
                <Sparkles className="w-4 h-4" />
                Giriş Yap & Mekan Keşfet
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ Modallar ═══════════ */}

      {/* 🔐 Auth Modal (Glassmorphism Kahve Teması) */}
      <AuthModal 
        isOpen={isAuthModalOpen || !isAuthenticated} 
        onClose={handleAuthClose} 
        hideClose={!isAuthenticated}
      />

      {/* 📍 Mekan Ekleme/Düzenleme Modal (Slide-in Drawer) */}
      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setTempMarker(null);
          setEditPlaceData(null);
        }}
        coordinates={tempMarker}
        editData={editPlaceData}
        onSuccess={() => {
          if (position) fetchNearbyPlaces(position);
        }}
      />
    </div>
  );
}
