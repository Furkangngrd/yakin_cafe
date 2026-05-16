import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 GERÇEK TATVAN MEKANLARI
//    Format: coordinates = [LONGITUDE, LATITUDE]
// ═══════════════════════════════════════════════════════════

const realTatvanPlaces = [
  // KAFELER
  { name: "Nova Cafe & Novaland Eğlence Merkezi", type: "cafe", location: { type: "Point", coordinates: [42.2835, 38.5020] } },
  { name: "Vonal Coffee Shop", type: "cafe", location: { type: "Point", coordinates: [42.2812, 38.5010] } },
  { name: "Luuq Coffee Tatvan", type: "cafe", location: { type: "Point", coordinates: [42.2850, 38.5042] } },
  { name: "Nada Coffee Co.", type: "cafe", location: { type: "Point", coordinates: [42.2795, 38.4995] } },
  { name: "Beybun Cafe & Nargile", type: "cafe", location: { type: "Point", coordinates: [42.2820, 38.5030] } },
  { name: "Güzelbahçe Vera Cafe Kahvaltı", type: "cafe", location: { type: "Point", coordinates: [42.2885, 38.5065] } },
  { name: "Andalus Coffee & Roastery", type: "cafe", location: { type: "Point", coordinates: [42.2805, 38.5008] } },
  { name: "Mejazz Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2840, 38.5025] } },
  { name: "Bilgin Cafe Restaurant", type: "cafe", location: { type: "Point", coordinates: [42.2830, 38.5018] } },
  { name: "Melodi Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2818, 38.5005] } },

  // RESTORANLAR
  { name: "Mavi Beyaz Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2910, 38.5080] } },
  { name: "Tatvan Şehri Ziyafet Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2780, 38.4980] } },
  { name: "Tatvan Fidan Restaurant & Patisserie", type: "restaurant", location: { type: "Point", coordinates: [42.2825, 38.5022] } },
  { name: "Anadolu Sofrası Tatvan", type: "restaurant", location: { type: "Point", coordinates: [42.2800, 38.5000] } },
  { name: "Gökte Ada Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2950, 38.5100] } },
  { name: "Arslanlar Pide Lahmacun Balık Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2775, 38.4975] } },
  { name: "Sanayi Lokantası", type: "restaurant", location: { type: "Point", coordinates: [42.2690, 38.4910] } },
  { name: "HapiFood Coffee & Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2845, 38.5035] } }
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

    const docs = realTatvanPlaces.map((p) => ({
      name: p.name,
      description: `${p.name} — Tatvan'da popüler bir mekan.`,
      category: p.type === "cafe" ? "kahve" : "restoran",
      priceLevel: Math.floor(Math.random() * 3) + 1,
      averageRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
      totalReviews: Math.floor(Math.random() * 200) + 50,
      location: p.location,
      address: { street: "", district: "Tatvan", city: "Bitlis" },
      amenities: ["wifi", "bahce"],
      images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const result = await Place.insertMany(docs);
    console.log(`✅ ${result.length} gerçek mekan başarıyla eklendi.\n`);

    result.forEach((p) => {
      const [lng, lat] = p.location.coordinates;
      console.log(`  📍 "${p.name}" [${p.category}] → [${lng}, ${lat}]`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
