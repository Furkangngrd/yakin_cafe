import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 🚀 ORİJİNAL ZENGİN SEED — 60 Mekan, 4 Bölge, Geniş Dağılım
//    Format: coordinates = [LONGITUDE, LATITUDE]
//    Kategori: "kahve" / "restoran" (Place.js enum uyumlu)
// ═══════════════════════════════════════════════════════════

const ALL_PLACES = [
  // ═══════════════════════════════════════════════
  // 📍 TATVAN SAHİL & ÇARŞI — 20 Mekan
  //    Merkez: ~[42.281, 38.501]
  // ═══════════════════════════════════════════════
  { name: "Nova Cafe & Novaland Eğlence Merkezi", cat: "kahve", coords: [42.2825, 38.4940] },
  { name: "Vonal Coffee Shop", cat: "kahve", coords: [42.2790, 38.5015] },
  { name: "Luuq Coffee Tatvan", cat: "kahve", coords: [42.2795, 38.5020] },
  { name: "Nada Coffee Co.", cat: "kahve", coords: [42.2785, 38.5005] },
  { name: "Beybun Cafe & Nargile", cat: "kahve", coords: [42.2800, 38.5035] },
  { name: "Andalus Coffee & Roastery", cat: "kahve", coords: [42.2780, 38.5010] },
  { name: "Mejazz Cafe", cat: "kahve", coords: [42.2792, 38.5025] },
  { name: "Cafe Keyf Tatvan", cat: "kahve", coords: [42.2810, 38.5040] },
  { name: "Kahve Deryası Tatvan", cat: "kahve", coords: [42.2820, 38.5050] },
  { name: "Dodo Sahil Cafe & Bistro", cat: "kahve", coords: [42.2825, 38.5055] },
  { name: "Tatvan İskele Cafe", cat: "kahve", coords: [42.2830, 38.5070] },
  { name: "Sultansaray Cafe", cat: "kahve", coords: [42.2805, 38.5022] },
  { name: "Mavi Beyaz Restaurant", cat: "restoran", coords: [42.2815, 38.5060] },
  { name: "Tatvan Şehri Ziyafet Restaurant", cat: "restoran", coords: [42.2770, 38.4990] },
  { name: "Tatvan Fidan Restaurant & Patisserie", cat: "restoran", coords: [42.2785, 38.5015] },
  { name: "Anadolu Sofrası Tatvan", cat: "restoran", coords: [42.2775, 38.5000] },
  { name: "Gökte Ada Restaurant", cat: "restoran", coords: [42.2800, 38.5045] },
  { name: "Arslanlar Pide Lahmacun Restaurant", cat: "restoran", coords: [42.2765, 38.4985] },
  { name: "HapiFood Coffee & Restaurant", cat: "restoran", coords: [42.2805, 38.5025] },
  { name: "Burger King Tatvan", cat: "restoran", coords: [42.2825, 38.4945] },

  // ═══════════════════════════════════════════════
  // 📍 TATVAN GENİŞ ÇEVRE — 10 Mekan
  //    Sahil yolu, Ahlat yolu, sanayi bölgesi
  // ═══════════════════════════════════════════════
  { name: "Sanayi Lokantası", cat: "restoran", coords: [42.2680, 38.5130] },
  { name: "Floryaa Fast Food Cafe", cat: "restoran", coords: [42.2810, 38.5030] },
  { name: "Meşhur Adana Tatlıcısı", cat: "restoran", coords: [42.2795, 38.5020] },
  { name: "VanTat Kahvaltı Salonu", cat: "restoran", coords: [42.2790, 38.5005] },
  { name: "Tatvan Market Kahvaltı Dünyası", cat: "restoran", coords: [42.2780, 38.4995] },
  { name: "Street Lab Tatvan", cat: "restoran", coords: [42.2800, 38.5015] },
  { name: "Bilgin Cafe Restaurant", cat: "kahve", coords: [42.2810, 38.5035] },
  { name: "Güzelbahçe Vera Cafe Kahvaltı", cat: "kahve", coords: [42.2885, 38.5065] },
  { name: "Cafeterya Monami", cat: "kahve", coords: [42.2788, 38.5008] },
  { name: "Tombak Cafe", cat: "kahve", coords: [42.2798, 38.5012] },

  // ═══════════════════════════════════════════════
  // 📍 BEÜ KAMPÜS & RAHVA — 15 Mekan
  //    Merkez: ~[42.159, 38.471]
  // ═══════════════════════════════════════════════
  { name: "Kampüs Kafe BEÜ", cat: "kahve", coords: [42.1598, 38.4718] },
  { name: "Rahva Çay Evi", cat: "kahve", coords: [42.1575, 38.4705] },
  { name: "Coffee Break BEÜ", cat: "kahve", coords: [42.1585, 38.4725] },
  { name: "Şato Cafe", cat: "kahve", coords: [42.1610, 38.4720] },
  { name: "Fasl-ı Muhabbet Cafe", cat: "kahve", coords: [42.1580, 38.4710] },
  { name: "Good For You Cafe", cat: "kahve", coords: [42.1590, 38.4730] },
  { name: "Yurt Yanı Büfe", cat: "restoran", coords: [42.1595, 38.4715] },
  { name: "Kampüs Pide Salonu", cat: "restoran", coords: [42.1605, 38.4728] },
  { name: "BEÜ Kebapçısı", cat: "restoran", coords: [42.1588, 38.4722] },
  { name: "Akademi Cafe", cat: "kahve", coords: [42.1592, 38.4735] },
  { name: "Rahva Nargile Cafe", cat: "kahve", coords: [42.1570, 38.4700] },
  { name: "Orsak Yolu Cafe", cat: "kahve", coords: [42.1680, 38.4200] },
  { name: "Yalnızçamlar Seyir Cafe", cat: "kahve", coords: [42.1620, 38.4550] },
  { name: "Başhan Çay Bahçesi", cat: "kahve", coords: [42.1500, 38.4580] },
  { name: "Yol Üstü Tantuni", cat: "restoran", coords: [42.1480, 38.4500] },

  // ═══════════════════════════════════════════════
  // 📍 BİTLİS MERKEZ / BEŞ MİNARE / ÇARŞI — 15 Mekan
  //    Merkez: ~[42.120, 38.406]
  // ═══════════════════════════════════════════════
  { name: "Beş Minare Cafe", cat: "kahve", coords: [42.1225, 38.4065] },
  { name: "Bitlis Kale Seyir Cafe", cat: "kahve", coords: [42.1190, 38.4045] },
  { name: "Dere Boyu Restaurant", cat: "restoran", coords: [42.1210, 38.4080] },
  { name: "Bitlis Büryan Evi", cat: "restoran", coords: [42.1200, 38.4060] },
  { name: "Yumurtatepe Dinlenme Tesisi", cat: "restoran", coords: [42.1280, 38.4200] },
  { name: "Değirmenaltı Kahvaltı Evi", cat: "restoran", coords: [42.1420, 38.4280] },
  { name: "Tabanözü Pide Salonu", cat: "restoran", coords: [42.1650, 38.4350] },
  { name: "Dört Ağaç Cafe", cat: "kahve", coords: [42.1550, 38.4310] },
  { name: "Vitamin Cafe", cat: "kahve", coords: [42.1150, 38.4050] },
  { name: "Sönmez Maraşlıoğlu", cat: "kahve", coords: [42.1130, 38.4030] },
  { name: "Nur Caddesi Kahvecisi", cat: "kahve", coords: [42.1180, 38.4055] },
  { name: "Eski Saray Cafe", cat: "kahve", coords: [42.1160, 38.4040] },
  { name: "Kale Altı Nargile", cat: "kahve", coords: [42.1195, 38.4070] },
  { name: "Merkez Pide Fırını", cat: "restoran", coords: [42.1170, 38.4048] },
  { name: "Bitlis Çiğ Köfte", cat: "restoran", coords: [42.1205, 38.4075] },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
];

const AMENITIES_POOL = [["wifi","priz"],["wifi"],["wifi","bahce"],["bahce","otopark"],["wifi","priz","bahce"],[]];

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

    // 3. Tüm mekanları ekle
    const docs = ALL_PLACES.map((p) => ({
      name: p.name,
      description: `${p.name} — Bitlis/Tatvan bölgesinde popüler bir mekan.`,
      category: p.cat,
      priceLevel: Math.floor(Math.random() * 3) + 1,
      averageRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 300) + 30,
      location: { type: "Point", coordinates: p.coords },
      address: { street: "", district: "Merkez", city: "Bitlis" },
      amenities: AMENITIES_POOL[Math.floor(Math.random() * AMENITIES_POOL.length)],
      images: [IMAGES[Math.floor(Math.random() * IMAGES.length)]],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const result = await Place.insertMany(docs);

    // Bölgesel sayım
    let tatvan = 0, rahva = 0, bitlis = 0;
    result.forEach((p) => {
      const [lng] = p.location.coordinates;
      if (lng > 42.25) tatvan++;
      else if (lng > 42.14) rahva++;
      else bitlis++;
    });

    console.log(`✅ Toplam ${result.length} mekan eklendi!\n`);
    console.log(`  🏔️  Tatvan Sahil & Çarşı:  ${tatvan} mekan`);
    console.log(`  🎓 Rahva / BEÜ Kampüs:    ${rahva} mekan`);
    console.log(`  🏛️  Bitlis Merkez / Çarşı:  ${bitlis} mekan`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    process.exit(1);
  }
}

seed();
