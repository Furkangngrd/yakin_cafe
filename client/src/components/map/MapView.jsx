import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ═══════════════════════════════════════════════════════════════
// 🗺️ MapView — React-Leaflet ile Premium Harita Bileşeni
//    • Fly-to animasyonu (giriş sonrası)
//    • Mavi radar-pulse "Sen Buradasın" işaretçisi
//    • Haritaya tıklayarak mekan ekleme
//    • Özel kahve temalı mekan pinleri
// ═══════════════════════════════════════════════════════════════

// ─── "Sen Buradasın" Radar Pulse İkonu ───
const userRadarIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
      <div class="user-pulse-ring"></div>
      <div class="user-pulse-ring-delay"></div>
      <div class="user-pulse-core"></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// ─── Yeni Mekan Ekleme İkonu (Amber + Plus) ───
const tempAddIcon = L.divIcon({
  className: "",
  html: `
    <div class="marker-drop" style="
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: 4px solid white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45), 0 0 0 4px rgba(245, 158, 11, 0.15);
      cursor: pointer;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -42],
});

// ─── Kategori Emoji Haritası (Popup İçin) ───
const categoryEmojis = {
  kahve: "☕",
  kafe: "☕",
  cafe: "☕",
  restoran: "🍽️",
  restaurant: "🍽️",
  pastane: "🧁",
  bar: "🍸",
  default: "📍",
};

function getCategoryEmoji(category) {
  if (!category) return categoryEmojis.default;
  const key = category.toLowerCase().trim();
  return categoryEmojis[key] || categoryEmojis.default;
}

// ─── Kategori İkon ve Renk Haritası ───
function getCategoryDesign(category, isActive) {
  const c = (category || "").toLowerCase().trim();
  
  if (c === "kahve" || c === "kafe" || c === "cafe") {
    return {
      svg: `<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>`,
      gradient: isActive ? "linear-gradient(135deg, #047857, #10b981, #34d399)" : "linear-gradient(135deg, #059669, #10b981)",
      shadow: isActive ? "rgba(16, 185, 129, 0.55)" : "rgba(16, 185, 129, 0.45)",
      ringClass: isActive ? "cafe-glow-ring-active" : "cafe-glow-ring",
      arrowColor: "#10b981"
    };
  }
  
  if (c === "restoran" || c === "restaurant") {
    return {
      svg: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
      gradient: isActive ? "linear-gradient(135deg, #be123c, #f43f5e, #fb7185)" : "linear-gradient(135deg, #e11d48, #fb7185)",
      shadow: isActive ? "rgba(225, 29, 72, 0.55)" : "rgba(225, 29, 72, 0.45)",
      ringClass: isActive ? "restoran-glow-ring-active" : "restoran-glow-ring",
      arrowColor: "#f43f5e"
    };
  }
  
  return {
    svg: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
    gradient: isActive ? "linear-gradient(135deg, #4338ca, #6366f1, #818cf8)" : "linear-gradient(135deg, #4f46e5, #818cf8)",
    shadow: isActive ? "rgba(79, 70, 229, 0.55)" : "rgba(79, 70, 229, 0.45)",
    ringClass: isActive ? "default-glow-ring-active" : "default-glow-ring",
    arrowColor: "#6366f1"
  };
}

// ─── Mekan Pin İkonu Oluşturucu (Parlayan Radar Pinleri) ───
function createPlaceIcon(isActive = false, category = null) {
  const markerSize = isActive ? 52 : 44;
  const iconSize = isActive ? 24 : 20;
  const glowRingSize = markerSize + 16;
  const design = getCategoryDesign(category, isActive);

  return L.divIcon({
    className: "",
    html: `
      <div class="cafe-marker-wrapper" style="
        position: relative;
        width: ${glowRingSize}px;
        height: ${glowRingSize + 14}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      ">
        <!-- Pulsing radar ring -->
        <div class="${design.ringClass}" style="
          position: absolute;
          top: 0; left: 0;
          width: ${glowRingSize}px;
          height: ${glowRingSize}px;
          border-radius: 50%;
        "></div>
        <!-- Main marker body -->
        <div style="
          width: ${markerSize}px;
          height: ${markerSize}px;
          background: ${design.gradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: ${isActive ? "4px" : "3.5px"} solid white;
          box-shadow: 0 8px 30px ${design.shadow}, 0 0 0 4px rgba(255,255,255,0.1);
          position: relative;
          z-index: 2;
          margin-top: ${(glowRingSize - markerSize) / 2}px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        ">
          <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${design.svg}
          </svg>
        </div>
        <!-- Bottom pointer arrow -->
        <div style="
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid ${design.arrowColor};
          margin-top: -3px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 3px 4px ${design.shadow});
        "></div>
      </div>
    `,
    iconSize: [glowRingSize, glowRingSize + 14],
    iconAnchor: [glowRingSize / 2, glowRingSize + 11],
    popupAnchor: [0, -(glowRingSize + 4)],
  });
}

// ─── Cluster İkon Oluşturucu (Zümrüt Yeşili Tema) ───
function createClusterCustomIcon(cluster) {
  const count = cluster.getChildCount();
  let size = 40;
  let ring = 52;
  let fontSize = 14;

  if (count >= 50) {
    size = 56; ring = 70; fontSize = 17;
  } else if (count >= 20) {
    size = 50; ring = 64; fontSize = 16;
  } else if (count >= 10) {
    size = 44; ring = 58; fontSize = 15;
  }

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: ${ring}px; height: ${ring}px;
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          position: absolute; inset: 0;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 50%;
          animation: clusterPulse 2s ease-in-out infinite;
        "></div>
        <div style="
          width: ${size}px; height: ${size}px;
          background: linear-gradient(135deg, #059669, #10b981);
          border: 4px solid white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4), 0 0 0 3px rgba(16, 185, 129, 0.12);
          color: white;
          font-weight: 900;
          font-size: ${fontSize}px;
          font-family: system-ui, sans-serif;
          z-index: 1;
        ">${count}</div>
      </div>
    `,
    iconSize: [ring, ring],
    iconAnchor: [ring / 2, ring / 2],
  });
}

// ═══════════════════════════════════════════
// 🚀 MapController — flyTo + click handler
// ═══════════════════════════════════════════
function MapController({ center, isFlying, onMapClick, onFlyEnd }) {
  const map = useMap();
  const prevCenterRef = useRef(null);

  useEffect(() => {
    if (!center) return;

    // Konum değişti mi kontrol et (aynı koordinata tekrar uçmasın)
    const prev = prevCenterRef.current;
    const isSameCenter = prev && prev.lat === center.lat && prev.lng === center.lng;

    if (!isSameCenter || isFlying) {
      // Zoom seviyesi 16 — yakın çevre net görünsün
      map.flyTo([center.lat, center.lng], 16, {
        duration: 2.5,
        easeLinearity: 0.25,
      });
      prevCenterRef.current = { lat: center.lat, lng: center.lng };
      // Uçuş bittiğinde parent'a bildir
      if (onFlyEnd) {
        setTimeout(() => onFlyEnd(), 2600);
      }
    }
  }, [center, isFlying, map, onFlyEnd]);

  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });

  return null;
}

// ═══════════════════════════════════════════
// 🗺️ Ana MapView Bileşeni
// ═══════════════════════════════════════════
export default function MapView({
  center,
  places = [],
  radius = 5000,
  onPlaceSelect,
  selectedPlace,
  isFlying = true,
  onMapClick,
  onFlyEnd,
  tempMarker,
  isAddMode,
}) {
  const defaultCenter = center || { lat: 38.412, lng: 42.115 }; // Rahva Yerleşkesi

  return (
    <div className="w-full h-full relative group rounded-[inherit]">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={16}
        zoomControl={false}
        maxZoom={19}
        className={`w-full h-full ${isAddMode ? '[&_.leaflet-interactive]:!cursor-crosshair !cursor-crosshair' : ''}`}
        style={{ borderRadius: "inherit" }}
      >
        {/* Premium harita tile — Google Maps Hack */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          maxZoom={19}
        />

        {/* Kontrol bileşeni */}
        <MapController
          center={center}
          isFlying={isFlying}
          onMapClick={onMapClick}
          onFlyEnd={onFlyEnd}
        />

        {/* 🟢 Arama yarıçapı çemberi */}
        {center && (
          <Circle
            center={[center.lat, center.lng]}
            radius={radius}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.04,
              weight: 1.5,
              dashArray: "6 10",
            }}
          />
        )}

        {/* 📍 Sen Buradasın — Radar Pulse Marker */}
        {center && (
          <Marker
            position={[center.lat, center.lng]}
            icon={userRadarIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="text-center py-1">
                <p className="font-bold text-sm text-gray-900">📍 Sen Buradasın</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 🟡 Yeni Eklenecek Yer Pin'i */}
        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={tempAddIcon}
            zIndexOffset={999}
          >
            <Popup>
              <div className="text-center py-1">
                <p className="font-bold text-sm text-amber-700">📌 Yeni Konum</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {tempMarker.lat.toFixed(5)}, {tempMarker.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ☕ Mekan Pinleri — Cluster Grubu */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          animate={true}
          animateAddingMarkers={true}
          disableClusteringAtZoom={18}
        >
          {places.map((place) => {
            const coords = place.location?.coordinates;
            if (!coords) return null;

            const isActive = selectedPlace?._id === place._id;

            return (
              <Marker
                key={place._id}
                position={[coords[1], coords[0]]}
                icon={createPlaceIcon(isActive, place.category)}
                eventHandlers={{ click: () => onPlaceSelect?.(place) }}
                zIndexOffset={isActive ? 500 : 0}
              >
                <Popup>
                  <div className="min-w-[200px] max-w-[260px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getCategoryEmoji(place.category)}</span>
                      <p className="font-extrabold text-sm text-gray-900 leading-tight">{place.name}</p>
                    </div>
                    {place.category && (
                      <span className="inline-block mb-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider border border-emerald-100">
                        {place.category}
                      </span>
                    )}
                    {place.description && (
                      <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{place.description}</p>
                    )}
                    {place.averageRating > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-xs ${s <= Math.round(place.averageRating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 font-bold">
                          {place.averageRating.toFixed(1)} ({place.totalReviews || 0})
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const name = encodeURIComponent(place.name);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${name}`, '_blank');
                      }}
                      className="w-full mt-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      🧭 Google Maps'te Aç
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* 📍 Koordinat Göstergesi (Seçildiğinde) */}
      {tempMarker && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/85 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-xs font-bold tracking-wider shadow-2xl border border-white/10 flex items-center gap-2 animate-gentle-bounce">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {tempMarker.lat.toFixed(4)}, {tempMarker.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
