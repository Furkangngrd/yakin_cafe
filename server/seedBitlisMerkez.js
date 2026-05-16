import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 SABİT KOORDİNAT SEED — ±0.002 max sapma, rastgele YOK
//    Format: coordinates = [LONGITUDE, LATITUDE]
//
//    Rahva BEÜ:       [42.1100, 38.4060]
//    Tatvan Çarşı:    [42.2810, 38.5015]
//    Bitlis Merkez:   [42.1070, 38.3995]
// ═══════════════════════════════════════════════════════════

const ALL_PLACES = [
  // ═══════════════════════════════════
  // 📍 RAHVA BEÜ — Merkez: [42.1100, 38.4060]
  // ═══════════════════════════════════
  { name: "Kampüs Kafe BEÜ",          cat: "kahve",    coords: [42.1100, 38.4060], price: 1, rating: 4.0, reviews: 120 },
  { name: "Coffee Break BEÜ",         cat: "kahve",    coords: [42.1110, 38.4070], price: 2, rating: 4.5, reviews: 67 },
  { name: "Rahva Çay Evi",            cat: "kahve",    coords: [42.1090, 38.4050], price: 1, rating: 3.8, reviews: 85 },
  { name: "Fakülte Kantini",          cat: "restoran", coords: [42.1105, 38.4055], price: 1, rating: 3.9, reviews: 150 },
  { name: "Kampüs Pide Salonu",       cat: "restoran", coords: [42.1115, 38.4065], price: 1, rating: 4.2, reviews: 90 },
  { name: "Şato Cafe",                cat: "kahve",    coords: [42.1120, 38.4075], price: 2, rating: 4.6, reviews: 87 },
  { name: "Yurt Yanı Büfe",           cat: "restoran", coords: [42.1095, 38.4045], price: 1, rating: 3.7, reviews: 60 },
  { name: "Akademi Cafe",             cat: "kahve",    coords: [42.1085, 38.4068], price: 2, rating: 4.3, reviews: 55 },
  { name: "BEÜ Kebapçısı",            cat: "restoran", coords: [42.1108, 38.4078], price: 1, rating: 4.1, reviews: 110 },
  { name: "Rahva Nargile Cafe",       cat: "kahve",    coords: [42.1092, 38.4042], price: 1, rating: 3.9, reviews: 45 },

  // ═══════════════════════════════════
  // 📍 TATVAN ÇARŞI — Merkez: [42.2810, 38.5015]
  // ═══════════════════════════════════
  { name: "Sahil Park Cafe",          cat: "kahve",    coords: [42.2810, 38.5015], price: 2, rating: 4.5, reviews: 120 },
  { name: "Göl Kıyısı Coffee",        cat: "kahve",    coords: [42.2800, 38.5020], price: 2, rating: 4.4, reviews: 95 },
  { name: "Tatvan Kitap Kafe",        cat: "kahve",    coords: [42.2820, 38.5010], price: 1, rating: 4.3, reviews: 78 },
  { name: "Liman Çay Bahçesi",        cat: "kahve",    coords: [42.2815, 38.5025], price: 1, rating: 4.1, reviews: 110 },
  { name: "Tatvan Sofrası",           cat: "restoran", coords: [42.2805, 38.5005], price: 1, rating: 4.4, reviews: 185 },
  { name: "Göl Balık Restaurant",     cat: "restoran", coords: [42.2825, 38.5020], price: 2, rating: 4.7, reviews: 240 },
  { name: "Tatvan Pide Salonu",       cat: "restoran", coords: [42.2795, 38.5010], price: 1, rating: 4.5, reviews: 195 },
  { name: "Sahil Kebap Evi",          cat: "restoran", coords: [42.2818, 38.5000], price: 2, rating: 4.3, reviews: 160 },
  { name: "Tatvan Büryan Salonu",     cat: "restoran", coords: [42.2808, 38.5030], price: 2, rating: 4.9, reviews: 320 },
  { name: "Hilal Cafe Tatvan",        cat: "kahve",    coords: [42.2830, 38.5018], price: 2, rating: 4.4, reviews: 67 },

  // ═══════════════════════════════════
  // 📍 BİTLİS MERKEZ ÇARŞI — Merkez: [42.1070, 38.3995]
  // ═══════════════════════════════════
  { name: "Merkez Kahve Evi",         cat: "kahve",    coords: [42.1070, 38.3995], price: 1, rating: 4.4, reviews: 110 },
  { name: "Beş Minare Cafe",          cat: "kahve",    coords: [42.1060, 38.4005], price: 2, rating: 4.6, reviews: 210 },
  { name: "Kale Altı Cafe",           cat: "kahve",    coords: [42.1080, 38.3985], price: 2, rating: 4.5, reviews: 145 },
  { name: "Nur Caddesi Kahvecisi",    cat: "kahve",    coords: [42.1075, 38.4000], price: 1, rating: 4.2, reviews: 190 },
  { name: "Eski Saray Cafe",          cat: "kahve",    coords: [42.1065, 38.3990], price: 2, rating: 4.5, reviews: 215 },
  { name: "Bitlis Büryan Evi",        cat: "restoran", coords: [42.1072, 38.3988], price: 2, rating: 4.9, reviews: 380 },
  { name: "Tarihi Bitlis Restoranı",  cat: "restoran", coords: [42.1068, 38.4002], price: 2, rating: 4.7, reviews: 200 },
  { name: "Dere Boyu Restaurant",     cat: "restoran", coords: [42.1082, 38.3998], price: 2, rating: 4.3, reviews: 195 },
  { name: "Has Saray Mutfağı",        cat: "restoran", coords: [42.1058, 38.3992], price: 3, rating: 4.8, reviews: 180 },
  { name: "Merkez Pide Fırını",       cat: "restoran", coords: [42.1078, 38.4008], price: 1, rating: 4.6, reviews: 275 },
];

const IMG = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes");
    console.log("✅ MongoDB bağlantısı başarılı.\n");

    // 1. Komple temizlik
    const del = await Place.deleteMany({});
    console.log(`🗑️  ${del.deletedCount} eski mekan silindi.`);
    try { await Place.collection.dropIndexes(); } catch (_) {}
    await Place.ensureIndexes();
    console.log("✅ İndeksler yenilendi.\n");

    // 2. Kullanıcı bul
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) { console.error("❌ Kullanıcı yok!"); process.exit(1); }

    // 3. Sabit koordinatlarla ekle
    const docs = ALL_PLACES.map((p) => ({
      name: p.name,
      description: `${p.name} — Bitlis bölgesinde hizmet veren popüler mekan.`,
      category: p.cat,
      priceLevel: p.price,
      averageRating: p.rating,
      totalReviews: p.reviews,
      location: { type: "Point", coordinates: p.coords },
      address: { street: "", district: "Merkez", city: "Bitlis" },
      amenities: ["wifi"],
      images: [IMG[Math.floor(Math.random() * IMG.length)]],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const result = await Place.insertMany(docs);
    console.log(`✅ ${result.length} mekan eklendi:\n`);
    result.forEach((p) => {
      const [lng, lat] = p.location.coordinates;
      console.log(`  📍 "${p.name}" [${p.category}] → [${lng}, ${lat}]`);
    });

    // 4. Doğrulama
    const r1 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [42.1100, 38.4060] }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    const r2 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [42.2810, 38.5015] }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    const r3 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [42.1070, 38.3995] }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    console.log(`\n🔍 Rahva BEÜ 5km:    ${r1.length} mekan`);
    console.log(`🔍 Tatvan Çarşı 5km: ${r2.length} mekan`);
    console.log(`🔍 Bitlis Merkez 5km: ${r3.length} mekan`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
