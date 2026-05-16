import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

const allPlaces = [
  // ================= TATVAN MEKANLARI =================
  { name: "Nova Cafe & Novaland Eğlence Merkezi Tatvan", type: "cafe", location: { type: "Point", coordinates: [42.2825, 38.4940] } },
  { name: "Vonal Coffee Shop", type: "cafe", location: { type: "Point", coordinates: [42.2790, 38.5015] } },
  { name: "Luuq Coffee Tatvan", type: "cafe", location: { type: "Point", coordinates: [42.2795, 38.5020] } },
  { name: "Nada Coffee Co.", type: "cafe", location: { type: "Point", coordinates: [42.2785, 38.5005] } },
  { name: "Beybun Cafe & Nargile", type: "cafe", location: { type: "Point", coordinates: [42.2800, 38.5035] } },
  { name: "Andalus Coffee & Roastery", type: "cafe", location: { type: "Point", coordinates: [42.2780, 38.5010] } },
  { name: "Mejazz Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2792, 38.5025] } },
  { name: "Cafe Keyf", type: "cafe", location: { type: "Point", coordinates: [42.2810, 38.5040] } },
  { name: "Cafe Bi Yer Tatvan", type: "cafe", location: { type: "Point", coordinates: [42.2815, 38.5045] } },
  { name: "Kahve Deryası", type: "cafe", location: { type: "Point", coordinates: [42.2820, 38.5050] } },
  { name: "Dodo Sahil Cafe & Bistro", type: "cafe", location: { type: "Point", coordinates: [42.2825, 38.5055] } },
  { name: "Cafeterya Monami", type: "cafe", location: { type: "Point", coordinates: [42.2788, 38.5008] } },
  { name: "Tatvan İskele Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2830, 38.5070] } },
  { name: "Tombak Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2805, 38.5022] } },
  { name: "Sultansaray Cafe", type: "cafe", location: { type: "Point", coordinates: [42.2805, 38.5022] } },
  { name: "Mavi Beyaz Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2815, 38.5060] } },
  { name: "Tatvan Şehri Ziyafet Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2770, 38.4990] } },
  { name: "Tatvan Fidan Restaurant & Patisserie", type: "restaurant", location: { type: "Point", coordinates: [42.2785, 38.5015] } },
  { name: "Anadolu Sofrası Tatvan", type: "restaurant", location: { type: "Point", coordinates: [42.2775, 38.5000] } },
  { name: "Gökte Ada Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2800, 38.5045] } },
  { name: "Arslanlar Pide Lahmacun Balık Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2765, 38.4985] } },
  { name: "Tatvan Market Kahvaltı Dünyası", type: "restaurant", location: { type: "Point", coordinates: [42.2780, 38.4995] } },
  { name: "VanTat Kahvaltı Ve Melemen Salonu", type: "restaurant", location: { type: "Point", coordinates: [42.2790, 38.5005] } },
  { name: "Meshur İstanbul börekçisi Van kahvaltı salonu", type: "restaurant", location: { type: "Point", coordinates: [42.2785, 38.5000] } },
  { name: "Burger King - Tatvan Yaşam Avm", type: "restaurant", location: { type: "Point", coordinates: [42.2825, 38.4940] } },
  { name: "Street Lab", type: "restaurant", location: { type: "Point", coordinates: [42.2800, 38.5015] } },
  { name: "Floryaa Fast Food Cafe", type: "restaurant", location: { type: "Point", coordinates: [42.2810, 38.5030] } },
  { name: "Meşhur Adana Tatlıcısı", type: "restaurant", location: { type: "Point", coordinates: [42.2795, 38.5020] } },
  { name: "Sanayi Lokantası", type: "restaurant", location: { type: "Point", coordinates: [42.2680, 38.5130] } },
  { name: "HapiFood Coffee & Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2805, 38.5025] } },
  { name: "Bilgin Cafe Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.2810, 38.5035] } },

  // ================= BİTLİS MERKEZ MEKANLARI =================
  { name: "Cafe Palet", type: "cafe", location: { type: "Point", coordinates: [42.1065, 38.4010] } },
  { name: "Sina Cafe", type: "cafe", location: { type: "Point", coordinates: [42.1055, 38.3985] } },
  { name: "Paşahan Cafe Restaurant", type: "cafe", location: { type: "Point", coordinates: [42.1080, 38.4005] } },
  { name: "Vitamin Cafe", type: "cafe", location: { type: "Point", coordinates: [42.1040, 38.3975] } },
  { name: "Starbucks", type: "cafe", location: { type: "Point", coordinates: [42.1095, 38.4020] } },
  { name: "Huge Maraşlıoğlu", type: "cafe", location: { type: "Point", coordinates: [42.1050, 38.3990] } },
  { name: "Modan Cafe", type: "cafe", location: { type: "Point", coordinates: [42.1075, 38.4015] } },
  { name: "Hasbihal Cafe&Restaurant", type: "cafe", location: { type: "Point", coordinates: [42.1060, 38.3980] } },
  { name: "Büryancı Vahit Usta Yeni Çarşı Şubesi", type: "restaurant", location: { type: "Point", coordinates: [42.1085, 38.4000] } },
  { name: "BİTLİS SOFRASI", type: "restaurant", location: { type: "Point", coordinates: [42.1090, 38.4012] } },
  { name: "Altın Kalbur Restorant", type: "restaurant", location: { type: "Point", coordinates: [42.1030, 38.3950] } },
  { name: "Sofuoğlu Restaurant & Büryan Salonu", type: "restaurant", location: { type: "Point", coordinates: [42.1070, 38.3995] } },
  { name: "Büryancı Azmi'nin Yeri", type: "restaurant", location: { type: "Point", coordinates: [42.1068, 38.3992] } },
  { name: "Divan Ocakbaşı", type: "restaurant", location: { type: "Point", coordinates: [42.1058, 38.3988] } },
  { name: "BEST DÜRÜM", type: "restaurant", location: { type: "Point", coordinates: [42.1048, 38.3982] } },
  { name: "Sina Cafe & Restaurant", type: "restaurant", location: { type: "Point", coordinates: [42.1052, 38.3986] } },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes");
    console.log("✅ MongoDB bağlantısı başarılı.\n");

    const del = await Place.deleteMany({});
    console.log(`🗑️  ${del.deletedCount} eski mekan silindi.\n`);

    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) { console.error("❌ Kullanıcı yok!"); process.exit(1); }

    const docs = allPlaces.map((p) => ({
      name: p.name,
      description: `${p.name} — Bitlis/Tatvan bölgesinde hizmet veren popüler mekan.`,
      category: p.type === "cafe" ? "kahve" : "restoran",
      priceLevel: 2,
      averageRating: 4.5,
      totalReviews: 100,
      location: p.location,
      address: { street: "", district: p.location.coordinates[0] > 42.2 ? "Tatvan" : "Merkez", city: "Bitlis" },
      amenities: ["wifi"],
      images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"],
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

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
