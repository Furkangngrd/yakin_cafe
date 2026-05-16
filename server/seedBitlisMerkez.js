import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 BÖLGESEL SEED — Her bölgeye tam 20 mekan
//    Format: coordinates = [LONGITUDE, LATITUDE]
//    Maksimum Sapma: +-0.005 (karada tutmak için sıkı sınır)
// ═══════════════════════════════════════════════════════════

const CENTERS = {
  TATVAN: [42.2810, 38.5015],
  RAHVA: [42.1100, 38.4060],
  BITLIS: [42.1070, 38.3995],
};

function generateSafeCoord(centerLng, centerLat) {
  // +- 0.005 sapma (yaklaşık 400-500 metre çapında bir alan)
  const lng = centerLng + (Math.random() - 0.5) * 0.01;
  const lat = centerLat + (Math.random() - 0.5) * 0.01;
  return [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))];
}

const CAFE_NAMES = [
  "Kahve Durağı", "Coffee Break", "Çay Evi", "Kitap Kafe", "Nargile Cafe", "Espresso Bar", 
  "Seyir Terrace", "Vadi Cafe", "Lounge", "Coffee House", "Çay Bahçesi", "Akademi Cafe", 
  "Meydan Cafe", "Sokak Kahvecisi", "Premium Cafe", "Teras Kafe", "Dostlar Kahvesi", 
  "Gençlik Kafe", "Mola Cafe", "Liman Cafe", "Göl Kıyısı Coffee", "Tarihi Kahveci"
];

const RESTAURANT_NAMES = [
  "Pide Salonu", "Kebap Evi", "Büryan Salonu", "Sofrası", "Balık Restaurant", "Dürüm Evi", 
  "Pizza House", "Burger", "Ev Yemekleri", "Kahvaltı Evi", "Tantuni", "Döner & Izgara", 
  "Lezzet Durağı", "Çiğ Köfte", "Mangal Evi", "Lokantası", "Tarihi Restoran", "Gurme"
];

const PREFIXES = {
  TATVAN: ["Tatvan", "Sahil", "Van Gölü", "Nemrut", "Çarşı", "Gölbaşı", "Liman"],
  RAHVA: ["Rahva", "Kampüs", "Eren", "Fakülte", "Akademi", "Üniversite", "Öğrenci"],
  BITLIS: ["Bitlis", "Merkez", "Beş Minare", "Şerefiye", "Kale", "Tarihi", "Nur"]
};

function generatePlaces(regionName, centerCoords, count = 20) {
  const places = [];
  const prefixes = PREFIXES[regionName];
  
  for (let i = 0; i < count; i++) {
    const isCafe = Math.random() > 0.5;
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseName = isCafe 
      ? CAFE_NAMES[Math.floor(Math.random() * CAFE_NAMES.length)]
      : RESTAURANT_NAMES[Math.floor(Math.random() * RESTAURANT_NAMES.length)];
      
    const name = `${prefix} ${baseName} ${Math.floor(Math.random() * 100)}`.trim();
    
    places.push({
      name: name,
      description: `${name} — ${regionName} bölgesinde hizmet veren mekan.`,
      category: isCafe ? "kahve" : "restoran",
      priceLevel: Math.floor(Math.random() * 3) + 1,
      averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 300) + 10,
      location: {
        type: "Point",
        coordinates: generateSafeCoord(centerCoords[0], centerCoords[1])
      },
      address: { street: "", district: regionName, city: "Bitlis" },
      amenities: ["wifi", Math.random() > 0.5 ? "priz" : "bahce"].filter(Boolean),
      images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"],
      isUserAdded: false,
      isActive: true,
    });
  }
  return places;
}

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

    // 3. Her bölge için tam 20'şer mekan üret (Toplam 60)
    const tatvanPlaces = generatePlaces("TATVAN", CENTERS.TATVAN, 20).map(p => ({ ...p, createdBy: user._id }));
    const rahvaPlaces = generatePlaces("RAHVA", CENTERS.RAHVA, 20).map(p => ({ ...p, createdBy: user._id }));
    const bitlisPlaces = generatePlaces("BITLIS", CENTERS.BITLIS, 20).map(p => ({ ...p, createdBy: user._id }));

    const allPlaces = [...tatvanPlaces, ...rahvaPlaces, ...bitlisPlaces];
    
    const result = await Place.insertMany(allPlaces);
    console.log(`✅ Toplam ${result.length} mekan başarıyla eklendi.\n`);

    // 4. Doğrulama (GeoNear ile her merkezin çevresinde tam 20 mekan var mı kontrolü)
    // Distance 2000m (2km) olarak ayarlandı ki Bitlis ve Rahva birbirine karışmasın
    const rTatvan = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.TATVAN }, distanceField: "d", maxDistance: 2000, spherical: true } }]);
    const rRahva = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.RAHVA }, distanceField: "d", maxDistance: 2000, spherical: true } }]);
    const rBitlis = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.BITLIS }, distanceField: "d", maxDistance: 2000, spherical: true } }]);
    
    console.log(`🔍 Tatvan Çarşı (2km Çevresi):  ${rTatvan.length} mekan eklendi`);
    console.log(`🔍 Rahva BEÜ (2km Çevresi):     ${rRahva.length} mekan eklendi`);
    console.log(`🔍 Bitlis Merkez (2km Çevresi): ${rBitlis.length} mekan eklendi`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
