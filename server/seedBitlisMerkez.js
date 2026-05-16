import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 GENİŞLETİLMİŞ SEED — 3 Bölge, Her Bölgeye 30+ Mekan
//    Format: coordinates = [LONGITUDE, LATITUDE]
//    Maksimum Sapma: +-0.005 (göle düşmemesi için katı sınır)
// ═══════════════════════════════════════════════════════════

const CENTERS = {
  RAHVA: [42.1100, 38.4060],
  TATVAN: [42.2810, 38.5015],
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
  "Gençlik Kafe", "Mola Cafe", "Liman Cafe", "Göl Kıyısı Coffee", "Tarihi Kahveci",
  "Nostalji Kafe", "Kahve Bahçesi", "Sahil Cafe", "Kampüs Cafe", "Merkez Kafe", "Gökkuşağı Kafe"
];

const RESTAURANT_NAMES = [
  "Pide Salonu", "Kebap Evi", "Büryan Salonu", "Sofrası", "Balık Restaurant", "Dürüm Evi", 
  "Pizza House", "Burger", "Ev Yemekleri", "Kahvaltı Evi", "Tantuni", "Döner & Izgara", 
  "Lezzet Durağı", "Çiğ Köfte", "Mangal Evi", "Lokantası", "Tarihi Restoran", "Gurme",
  "Ziyafet Sofrası", "Saray Mutfağı", "Kavurma Salonu", "Usta Elleri", "Köfteci", "Tatvan Mutfağı"
];

const PREFIXES = {
  RAHVA: ["Rahva", "Kampüs", "Eren", "Fakülte", "Akademi", "Üniversite", "Öğrenci"],
  TATVAN: ["Tatvan", "Sahil", "Van Gölü", "Nemrut", "Çarşı", "Gölbaşı", "Liman", "Süphan"],
  BITLIS: ["Bitlis", "Merkez", "Beş Minare", "Şerefiye", "Kale", "Tarihi", "Nur", "Dere"]
};

function generatePlaces(regionName, centerCoords, count = 30) {
  const places = [];
  const prefixes = PREFIXES[regionName];
  
  for (let i = 0; i < count; i++) {
    const isCafe = Math.random() > 0.5;
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const baseName = isCafe 
      ? CAFE_NAMES[Math.floor(Math.random() * CAFE_NAMES.length)]
      : RESTAURANT_NAMES[Math.floor(Math.random() * RESTAURANT_NAMES.length)];
      
    // Benzersiz isim oluşturma denemesi (basit)
    const name = `${prefix} ${baseName} ${Math.random() > 0.7 ? (i + 1) : ""}`.trim();
    
    places.push({
      name: name,
      description: `${name} — ${regionName} bölgesinde popüler bir mekan.`,
      category: isCafe ? "kahve" : "restoran",
      priceLevel: Math.floor(Math.random() * 3) + 1, // 1 to 3
      averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
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

    // 3. Her bölge için 35'er mekan üret (Toplam 105)
    const rahvaPlaces = generatePlaces("RAHVA", CENTERS.RAHVA, 35).map(p => ({ ...p, createdBy: user._id }));
    const tatvanPlaces = generatePlaces("TATVAN", CENTERS.TATVAN, 35).map(p => ({ ...p, createdBy: user._id }));
    const bitlisPlaces = generatePlaces("BITLIS", CENTERS.BITLIS, 35).map(p => ({ ...p, createdBy: user._id }));

    const allPlaces = [...rahvaPlaces, ...tatvanPlaces, ...bitlisPlaces];
    
    const result = await Place.insertMany(allPlaces);
    console.log(`✅ Toplam ${result.length} mekan başarıyla eklendi.\n`);
    
    // Rastgele 5 tanesini göster
    console.log("📝 Eklenen mekanlardan örnekler:");
    for(let i=0; i<5; i++) {
        const p = result[Math.floor(Math.random() * result.length)];
        const [lng, lat] = p.location.coordinates;
        console.log(`  📍 "${p.name}" [${p.category}] → [${lng}, ${lat}]`);
    }

    // 4. Doğrulama
    const r1 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.RAHVA }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    const r2 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.TATVAN }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    const r3 = await Place.aggregate([{ $geoNear: { near: { type: "Point", coordinates: CENTERS.BITLIS }, distanceField: "d", maxDistance: 5000, spherical: true } }]);
    
    console.log(`\n🔍 Rahva BEÜ 5km Çevresi:     ${r1.length} mekan bulundu`);
    console.log(`🔍 Tatvan Çarşı 5km Çevresi:  ${r2.length} mekan bulundu`);
    console.log(`🔍 Bitlis Merkez 5km Çevresi: ${r3.length} mekan bulundu`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
