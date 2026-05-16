import { motion } from "framer-motion";
import PlaceCard from "./PlaceCard";
import { SearchX, MapPin, Plus } from "lucide-react";

export default function PlaceList({ places = [], loading, onSelect, onFavorite, favorites = [], onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[4/3] w-full rounded-xl skeleton" />
            <div className="h-5 w-2/3 skeleton" />
            <div className="h-4 w-1/3 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (!places.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 text-center px-4"
      >
        {/* Büyük İkon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center mb-5 shadow-inner">
          <SearchX className="w-9 h-9 text-brand-400" />
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-1.5">
          Mekan bulunamadı
        </h3>
        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-5">
          Aradığın mekanı bulamadın mı? Haritada istediğin konuma tıklayarak
          sen de ekleyebilirsin!
        </p>

        {/* Yönlendirme */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3 max-w-xs">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-emerald-700 text-left leading-snug">
            Sağ alttaki <span className="text-emerald-900">"Mekan Ekle"</span> butonuna
            basarak haritaya sen ekle!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
      {places.map((place, idx) => (
        <PlaceCard
          key={place._id}
          place={place}
          index={idx}
          onSelect={onSelect}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(place._id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
