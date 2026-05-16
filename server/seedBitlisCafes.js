import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// ☕ Bitlis Eren Üniversitesi Çevresi — Gerçek Kafeler
//    Koordinatlar: [Longitude, Latitude] (MongoDB GeoJSON)
// ═══════════════════════════════════════════════════════════

const BITLIS_CAFES = [
  // ── BEÜ Kampüs ve Rahva Bölgesi ──
  {
    name: "Kampüs Kafe BEÜ",
    description: "Bitlis Eren Üniversitesi ana kampüs içi öğrenci kafeteryası. Uygun fiyat, hızlı WiFi.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.0,
    totalReviews: 120,
    location: { type: "Point", coordinates: [42.1598, 38.4718] },
    address: { street: "BEÜ Kampüs", district: "Rahva", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Rahva Çay Evi",
    description: "Kampüs çıkışında öğrencilerin uğrak noktası. Çay, kahve ve tost.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 3.8,
    totalReviews: 85,
    location: { type: "Point", coordinates: [42.1575, 38.4705] },
    address: { street: "Rahva Yolu", district: "Rahva", city: "Bitlis" },
    amenities: ["wifi"],
  },
  {
    name: "Coffee Break BEÜ",
    description: "3. dalga kahve konseptiyle öğrencilere özel filtre kahve ve cold brew.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.5,
    totalReviews: 67,
    location: { type: "Point", coordinates: [42.1585, 38.4725] },
    address: { street: "Üniversite Caddesi", district: "Rahva", city: "Bitlis" },
    amenities: ["wifi", "priz", "bahce"],
  },

  // ── Beş Minare / Bitlis Merkez ──
  {
    name: "Beş Minare Cafe",
    description: "Tarihi Beş Minare'ye nazır manzaralı kafe. Bitlis'in en ikonik konumunda.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.6,
    totalReviews: 210,
    location: { type: "Point", coordinates: [42.1225, 38.4065] },
    address: { street: "Beş Minare Mevkii", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "bahce"],
  },
  {
    name: "Bitlis Kale Seyir Cafe",
    description: "Bitlis Kalesi'ne yakın, şehir manzaralı seyir teraslı kafe.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.4,
    totalReviews: 155,
    location: { type: "Point", coordinates: [42.1190, 38.4045] },
    address: { street: "Kale Yolu", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "bahce"],
  },
  {
    name: "Dere Boyu Restaurant",
    description: "Bitlis Deresi kenarında yöresel lezzetler sunan aile restoranı.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.3,
    totalReviews: 195,
    location: { type: "Point", coordinates: [42.1210, 38.4080] },
    address: { street: "Dere Boyu Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce"],
  },

  // ── Yumurtatepe / E99 Güzergahı ──
  {
    name: "Yumurtatepe Dinlenme Tesisi",
    description: "E99 karayolu üzerinde, yolculara hizmet veren mola noktası ve restoran.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 3.9,
    totalReviews: 130,
    location: { type: "Point", coordinates: [42.1280, 38.4200] },
    address: { street: "E99 Karayolu", district: "Yumurtatepe", city: "Bitlis" },
    amenities: ["otopark"],
  },
  {
    name: "Değirmenaltı Kahvaltı Evi",
    description: "Serpme kahvaltısıyla ünlü, doğa içinde huzurlu bir mekan.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.7,
    totalReviews: 245,
    location: { type: "Point", coordinates: [42.1420, 38.4280] },
    address: { street: "Değirmenaltı", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce", "otopark"],
  },

  // ── Başhan / Kuzey Bitlis ──
  {
    name: "Başhan Çay Bahçesi",
    description: "Başhan köyü girişinde, doğa manzaralı geleneksel çay bahçesi.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.1,
    totalReviews: 55,
    location: { type: "Point", coordinates: [42.1500, 38.4580] },
    address: { street: "Başhan Yolu", district: "Başhan", city: "Bitlis" },
    amenities: ["bahce"],
  },

  // ── Tabanözü Bölgesi ──
  {
    name: "Tabanözü Pide Salonu",
    description: "El açması Bitlis pidesi ve lahmacunuyla meşhur yerel lezzet durağı.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.5,
    totalReviews: 180,
    location: { type: "Point", coordinates: [42.1650, 38.4350] },
    address: { street: "Tabanözü", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Dört Ağaç Cafe",
    description: "Dörtağaç semtinde, gençlerin buluşma noktası olan modern kafe.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.2,
    totalReviews: 92,
    location: { type: "Point", coordinates: [42.1550, 38.4310] },
    address: { street: "Dörtağaç", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },

  // ── E99 Üzeri / Kampüse Giden Yol ──
  {
    name: "Yol Üstü Tantuni",
    description: "Mersin usulü tantuni ve dürüm çeşitleriyle öğrenci favorisi.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.0,
    totalReviews: 75,
    location: { type: "Point", coordinates: [42.1480, 38.4500] },
    address: { street: "E99 Karayolu", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Bitlis Büryan Evi",
    description: "Geleneksel Bitlis büryan kebabını odun ateşinde pişiren otantik mekan.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.8,
    totalReviews: 340,
    location: { type: "Point", coordinates: [42.1200, 38.4060] },
    address: { street: "Çarşı İçi", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Orsak Yolu Cafe",
    description: "Orsak yolu üzerinde mola vermek için ideal, sakin atmosferli kafe.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 3.7,
    totalReviews: 42,
    location: { type: "Point", coordinates: [42.1680, 38.4200] },
    address: { street: "Orsak Yolu", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi"],
  },
  {
    name: "Yalnızçamlar Seyir Cafe",
    description: "Yalnızçamlar tepesinde panoramik Bitlis manzarası sunan seyir kafesi.",
    category: "kahve",
    priceLevel: 3,
    averageRating: 4.6,
    totalReviews: 168,
    location: { type: "Point", coordinates: [42.1620, 38.4550] },
    address: { street: "Yalnızçamlar", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "bahce", "otopark"],
  },
];

// Unsplash görselleri
const IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı.");

    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) {
      console.error("❌ Kullanıcı bulunamadı!");
      process.exit(1);
    }
    console.log(`👤 Mekanlar "${user.name}" adına eklenecek.\n`);

    let added = 0, skipped = 0;

    for (const cafe of BITLIS_CAFES) {
      const exists = await Place.findOne({ name: cafe.name });
      if (exists) {
        console.log(`  ⏩ "${cafe.name}" zaten mevcut.`);
        skipped++;
        continue;
      }

      await Place.create({
        ...cafe,
        images: [IMAGES[Math.floor(Math.random() * IMAGES.length)]],
        createdBy: user._id,
        isActive: true,
      });
      console.log(`  ✅ "${cafe.name}" eklendi.`);
      added++;
    }

    console.log(`\n🎉 Tamamlandı! ${added} yeni mekan eklendi, ${skipped} atlandı.`);
    const total = await Place.countDocuments();
    console.log(`📊 Veritabanında toplam ${total} mekan var.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Hata:", err.message);
    process.exit(1);
  }
}

seed();
