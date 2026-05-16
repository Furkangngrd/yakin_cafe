import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Kategori etiketlerini Türkçe karşılıklarına çevirir
 */
export const categoryLabels = {
  kahve: "Kahve",
  tatli: "Tatlı",
  "calisma-alani": "Çalışma Alanı",
  restoran: "Restoran",
  bar: "Bar",
  pastane: "Pastane",
  brunch: "Brunch",
  diger: "Diğer",
};

/**
 * Kategori emojileri
 */
export const categoryEmojis = {
  kahve: "☕",
  tatli: "🍰",
  "calisma-alani": "💻",
  restoran: "🍽️",
  bar: "🍸",
  pastane: "🧁",
  brunch: "🥞",
  diger: "📍",
};

/**
 * Fiyat seviyesi gösterimi
 */
export const priceLevelLabels = {
  1: "₺",
  2: "₺₺",
  3: "₺₺₺",
  4: "₺₺₺₺",
};

/**
 * Mesafe formatlama
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
