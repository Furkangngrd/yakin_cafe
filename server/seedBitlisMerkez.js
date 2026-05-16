import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 SABİT KOORDİNAT SEED — Rastgele üretim YOK
//    Tüm koordinatlar elle girilmiş kara noktalarıdır.
//    Format: [Longitude, Latitude]
// ═══════════════════════════════════════════════════════════

const REAL_PLACES = [
  // ─── TATVAN GRUBU (Sahil ve Çarşı civarı) ───
  { name: "Sahil Cafe",       category: "kahve",    priceLevel: 2, averageRating: 4.5, totalReviews: 120, location: { type: "Point", coordinates: [42.290, 38.505] }, address: { district: "Tatvan", city: "Bitlis" } },
  { name: "Çarşı Restoran",   category: "restoran", priceLevel: 2, averageRating: 4.3, totalReviews: 95,  location: { type: "Point", coordinates: [42.282, 38.500] }, address: { district: "Tatvan", city: "Bitlis" } },
  { name: "Göl Evi Kafesi",   category: "kahve",    priceLevel: 2, averageRating: 4.6, totalReviews: 80,  location: { type: "Point", coordinates: [42.295, 38.508] }, address: { district: "Tatvan", city: "Bitlis" } },
  { name: "Tatvan Burger",    category: "restoran", priceLevel: 1, averageRating: 4.1, totalReviews: 65,  location: { type: "Point", coordinates: [42.279, 38.498] }, address: { district: "Tatvan", city: "Bitlis" } },

  // ─── BİTLİS MERKEZ GRUBU (Çarşı ve Nur Caddesi civarı) ───
  { name: "Merkez Kahve Evi",         category: "kahve",    priceLevel: 1, averageRating: 4.4, totalReviews: 110, location: { type: "Point", coordinates: [42.108, 38.394] }, address: { district: "Merkez", city: "Bitlis" } },
  { name: "Tarihi Bitlis Restoranı",  category: "restoran", priceLevel: 2, averageRating: 4.7, totalReviews: 200, location: { type: "Point", coordinates: [42.105, 38.391] }, address: { district: "Merkez", city: "Bitlis" } },
  { name: "Kale Altı Cafe",           category: "kahve",    priceLevel: 2, averageRating: 4.5, totalReviews: 145, location: { type: "Point", coordinates: [42.112, 38.398] }, address: { district: "Merkez", city: "Bitlis" } },
  { name: "Has Saray Mutfağı",        category: "restoran", priceLevel: 3, averageRating: 4.8, totalReviews: 180, location: { type: "Point", coordinates: [42.102, 38.388] }, address: { district: "Merkez", city: "Bitlis" } },
];

async function seed() {
  try {
    const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(URI);
    console.log("✅ MongoDB bağlantısı başarılı.\n");

    // 1. Komple temizlik
    const del = await Place.deleteMany({});
    console.log(`🗑️  ${del.deletedCount} eski mekan silindi.\n`);

    // 2. Kullanıcı bul
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) { console.error("❌ Kullanıcı yok!"); process.exit(1); }

    // 3. Sabit koordinatlı mekanları ekle
    const docs = REAL_PLACES.map((p) => ({
      ...p,
      description: p.name + " — Bitlis/Tatvan bölgesinde hizmet veren mekan.",
      images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"],
      amenities: ["wifi"],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const result = await Place.insertMany(docs);
    console.log(`✅ ${result.length} mekan eklendi:\n`);
    result.forEach((p) => {
      const [lng, lat] = p.location.coordinates;
      console.log(`   📍 "${p.name}" [${p.category}] → [Lng: ${lng}, Lat: ${lat}]`);
    });

    // 4. Doğrulama
    const t1 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [42.285, 38.503] }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    const t2 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [42.108, 38.394] }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    console.log(`\n🔍 Tatvan 5km:  ${t1.length} mekan`);
    console.log(`🔍 Bitlis 5km:  ${t2.length} mekan`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
