import { motion } from "framer-motion";
import { Star, MapPin, Heart, Trash2, Edit3 } from "lucide-react";
import { categoryLabels, priceLevelLabels, formatDistance } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export default function PlaceCard({ place, index = 0, onSelect, onFavorite, isFavorite, onEdit, onDelete }) {
  const { user } = useAuth();

  const {
    name,
    category,
    averageRating,
    totalReviews,
    priceLevel,
    distance,
    distanceKm,
    image,
    address
  } = place;

  const displayDistance = distanceKm
    ? `${distanceKm} km`
    : distance
    ? formatDistance(distance)
    : null;

  // Gerçek görsel yoksa varsayılan bir görsel kullan
  const imageUrl = image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";

  const creatorId = typeof place.createdBy === 'object' ? place.createdBy?._id || place.createdBy?.id : place.createdBy;
  const userId = user?._id || user?.id;
  const isOwner = user && creatorId && creatorId === userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onSelect?.(place)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Floating Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(place._id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all z-10"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`}
          />
        </button>

        {/* Category Badge overlaying image bottom */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md shadow-sm">
          <span className="text-xs font-bold text-primary-600">
            {categoryLabels[category] || category}
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-bold text-text-primary truncate pr-2">
            {name}
          </h3>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-text-primary fill-text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-text-secondary truncate mt-0.5">
          {address?.district}, {address?.city}
        </p>

        <div className="flex items-center gap-2 mt-1 text-sm text-text-muted">
          {displayDistance && (
            <span className="font-medium text-text-secondary">
              {displayDistance}
            </span>
          )}
          {displayDistance && priceLevel && <span>·</span>}
          {priceLevel && (
            <span className="font-medium">
              {priceLevelLabels[priceLevel]}
            </span>
          )}
          <span>·</span>
          <span>{totalReviews} değerlendirme</span>
        </div>

        {/* Google Maps Yol Tarifi Butonu */}
        {place.name && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-all shadow-sm hover:shadow-md"
          >
            <MapPin className="w-4 h-4" />
            Yol Tarifi Al
          </a>
        )}

        {/* Aksiyon Butonları (Sadece Sahibi İçin) */}
        {isOwner && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(place);
              }}
              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold py-2 rounded-xl flex justify-center items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Düzenle
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Bu mekanı silmek istediğinize emin misiniz?")) {
                  onDelete?.(place._id);
                }
              }}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2 rounded-xl flex justify-center items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Sil
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
