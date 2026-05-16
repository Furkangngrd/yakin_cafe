import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// ☕ seedRealCafes.js — Gerçek Bitlis/Tatvan Mekanları
//    Mevcut verileri SİLMEDEN yeni mekanları ekler.
// ═══════════════════════════════════════════════════════════

const REAL_CAFES = [
  {
    name: "Şato Cafe",
    description: "Bitlis'in tarihi dokusunda, şık atmosferiyle öne çıkan popüler kafe.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 5,
    totalReviews: 87,
    location: { type: "Point", coordinates: [42.1610, 38.4720] },
    address: { district: "Merkez", city: "Bitlis" },
    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"],
    amenities: ["wifi", "bahce"],
  },
  {
    name: "Fasl-ı Muhabbet Cafe",
    description: "Dostlarla buluşma noktası, sıcak ortamı ve zengin menüsüyle tercih edilen kafe.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4,
    totalReviews: 63,
    location: { type: "Point", coordinates: [42.1380, 38.4350] },
    address: { district: "Merkez", city: "Bitlis" },
    images: ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80"],
    amenities: ["wifi"],
  },
  {
    name: "Good For You",
    description: "Sağlıklı yaşam konseptli, 3. dalga kahve ve organik atıştırmalıklar sunan modern kafe.",
    category: "kahve",
    priceLevel: 3,
    averageRating: 5,
    totalReviews: 112,
    location: { type: "Point", coordinates: [42.1250, 38.4180] },
    address: { district: "Merkez", city: "Bitlis" },
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"],
    amenities: ["wifi", "priz", "bahce"],
  },
  {
    name: "Vitamin Cafe",
    description: "Taze sıkılmış meyve suları ve ekonomik fiyatlarıyla öğrencilerin gözdesi.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4,
    totalReviews: 45,
    location: { type: "Point", coordinates: [42.1150, 38.4050] },
    address: { district: "Merkez", city: "Bitlis" },
    images: ["https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80"],
    amenities: ["wifi"],
  },
  {
    name: "Sönmez Maraşlıoğlu",
    description: "Geleneksel dondurma ve Maraş usulü lezzetleriyle ünlü tatlıcı.",
    category: "tatli",
    priceLevel: 1,
    averageRating: 4,
    totalReviews: 198,
    location: { type: "Point", coordinates: [42.1130, 38.4030] },
    address: { district: "Merkez", city: "Bitlis" },
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80"],
    amenities: [],
  },
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı.");

    // Mevcut bir kullanıcıyı bul (createdBy zorunlu alan)
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.error("❌ Veritabanında hiç kullanıcı yok! Önce ana seed'i çalıştırın.");
      process.exit(1);
    }
    console.log(`👤 Mekanlar "${user.name}" kullanıcısına atanacak.`);

    // Her mekana createdBy ekle
    const cafesWithOwner = REAL_CAFES.map((cafe) => ({
      ...cafe,
      createdBy: user._id,
      isActive: true,
    }));

    // Aynı isimde mekan varsa tekrar eklemeyi önle
    let insertCount = 0;
    for (const cafe of cafesWithOwner) {
      const exists = await Place.findOne({ name: cafe.name });
      if (exists) {
        console.log(`⏩ "${cafe.name}" zaten mevcut, atlanıyor.`);
      } else {
        await Place.create(cafe);
        console.log(`  ✅ "${cafe.name}" eklendi.`);
        insertCount++;
      }
    }

    console.log(`\n🎉 Gerçek mekanlar başarıyla eklendi! (${insertCount} yeni, ${REAL_CAFES.length - insertCount} mevcut)`);
    await mongoose.disconnect();
    console.log("🔌 MongoDB bağlantısı kapatıldı.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Hatası:", error.message);
    process.exit(1);
  }
}

seed();
