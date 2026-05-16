import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 🚀 KURTARMA SEED — Tatvan + Bitlis Merkez
//
//    MongoDB GeoJSON kuralı: coordinates = [LONGITUDE, LATITUDE]
//
//    TATVAN MERKEZİ:        [42.285, 38.503]   (Lng, Lat)
//    BİTLİS MERKEZ MERKEZİ: [42.108, 38.394]   (Lng, Lat)
//
//    Kategori enum değerleri: "kahve", "restoran" (Place.js'e birebir uyumlu)
// ═══════════════════════════════════════════════════════════

// ─── Yardımcı: Merkez etrafında rastgele koordinat ───
// spread ~0.015 ≈ 1.5km, böylece 2-3km çapa dağılım sağlanır
function scatter(centerLng, centerLat) {
  const lng = centerLng + (Math.random() - 0.5) * 0.030;
  const lat = centerLat + (Math.random() - 0.5) * 0.020;
  return [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))];
}

// ═══════════════════════════════════════════════════════════
// 📍 TATVAN MEKANLARI — Merkez: [42.285, 38.503]
// ═══════════════════════════════════════════════════════════
const TATVAN = [
  // ☕ Kafeler
  { name: "Sahil Park Cafe", desc: "Tatvan Sahil Parkı'nda Van Gölü manzaralı kafe. Gün batımında eşsiz atmosfer.", cat: "kahve", price: 2, rating: 4.7, reviews: 210 },
  { name: "Göl Kıyısı Coffee", desc: "Van Gölü kıyısında 3. dalga kahve deneyimi. Filtre kahve ve cold brew.", cat: "kahve", price: 2, rating: 4.5, reviews: 145 },
  { name: "Tatvan Kitap Kafe", desc: "Kitap okuyarak kahve içebileceğiniz sakin ve kültürel bir mekan.", cat: "kahve", price: 1, rating: 4.3, reviews: 78 },
  { name: "Liman Çay Bahçesi", desc: "Feribot iskelesi yakınında, gölü izlerken çay keyfi yapabileceğiniz bahçe.", cat: "kahve", price: 1, rating: 4.1, reviews: 120 },
  { name: "Nemrut Seyir Cafe", desc: "Nemrut Krater Gölü yolunda mola noktası. Panoramik dağ manzarası.", cat: "kahve", price: 2, rating: 4.6, reviews: 95 },
  { name: "Tatvan Nargile & Cafe", desc: "Geniş nargile menüsü ve arkadaş ortamıyla Tatvan gençliğinin buluşma yeri.", cat: "kahve", price: 1, rating: 3.9, reviews: 88 },
  { name: "Mavi Göl Espresso", desc: "Tatvan merkezde mini espresso bar. Hızlı kahve al, yoluna devam et.", cat: "kahve", price: 1, rating: 4.0, reviews: 52 },
  { name: "Hilal Cafe Tatvan", desc: "Modern dekorasyonu ve latte art ile ünlü, genç girişimcilerin kafesi.", cat: "kahve", price: 2, rating: 4.4, reviews: 67 },
  { name: "Ahlat Yolu Çay Evi", desc: "Ahlat yolu üzerinde yolcuların mola verdiği geleneksel çay evi.", cat: "kahve", price: 1, rating: 3.8, reviews: 45 },
  { name: "Süphan Terrace Cafe", desc: "Süphan Dağı manzarasına bakan teraslı kafe. Fotoğraf çekmek için ideal.", cat: "kahve", price: 3, rating: 4.8, reviews: 130 },
  // 🍽️ Restoranlar
  { name: "Tatvan Sofrası", desc: "Ev yemekleri ve yöresel Tatvan mutfağı. Her gün taze hazırlanan menü.", cat: "restoran", price: 1, rating: 4.4, reviews: 185 },
  { name: "Göl Balık Restaurant", desc: "Van Gölü'nden taze inci kefali ve alabalık ızgara. Göl manzaralı salon.", cat: "restoran", price: 2, rating: 4.7, reviews: 240 },
  { name: "Tatvan Pide Salonu", desc: "Taş fırında el açması pide, lahmacun ve Bitlis usulü döner.", cat: "restoran", price: 1, rating: 4.5, reviews: 195 },
  { name: "Sahil Kebap Evi", desc: "Sahil yolunda adana, urfa ve patlıcan kebap çeşitleri.", cat: "restoran", price: 2, rating: 4.3, reviews: 160 },
  { name: "Lezzet Durağı Tatvan", desc: "Karışık ızgara, kuzu tandır ve mercimek çorbası ile dolu dolu öğle yemeği.", cat: "restoran", price: 2, rating: 4.2, reviews: 110 },
  { name: "Nemrut Kahvaltı Evi", desc: "Serpme kahvaltı, Van otlu peyniri, kaymak-bal ve taze tandır ekmeği.", cat: "restoran", price: 2, rating: 4.8, reviews: 275 },
  { name: "Çarşı İçi Dürüm Tatvan", desc: "Tantuni, tavuk dürüm ve çiğ köfte rulolarıyla öğrenci favorisi.", cat: "restoran", price: 1, rating: 4.1, reviews: 90 },
  { name: "Tatvan Büryan Salonu", desc: "Geleneksel büryan kebabı, odun ateşinde pişen efsane lezzet.", cat: "restoran", price: 2, rating: 4.9, reviews: 320 },
  { name: "Gölbaşı Aile Restoranı", desc: "Geniş aileler için ideal, çocuk oyun alanı ve zengin menü.", cat: "restoran", price: 2, rating: 4.3, reviews: 140 },
  { name: "Pizza House Tatvan", desc: "El yapımı pizza, burger ve patates kızartması. Gençlerin gözdesi.", cat: "restoran", price: 2, rating: 4.0, reviews: 75 },
];

// ═══════════════════════════════════════════════════════════
// 📍 BİTLİS MERKEZ MEKANLARI — Merkez: [42.108, 38.394]
// ═══════════════════════════════════════════════════════════
const BITLIS_MERKEZ = [
  // ☕ Kafeler
  { name: "Şerefiye Kahve Evi", desc: "Şerefiye mahallesinin kalbinde, samimi atmosferiyle esnafın buluşma noktası.", cat: "kahve", price: 1, rating: 4.3, reviews: 142 },
  { name: "Beş Minare Cafe", desc: "Tarihi Beş Minare'ye nazır manzaralı kafe. Bitlis'in en ikonik konumunda.", cat: "kahve", price: 2, rating: 4.6, reviews: 210 },
  { name: "Kale Seyir Terrace", desc: "Bitlis Kalesi'ne yakın, şehir manzaralı seyir teraslı kafe.", cat: "kahve", price: 2, rating: 4.4, reviews: 155 },
  { name: "Dere Kenarı Çay Bahçesi", desc: "Bitlis Deresi kenarında doğayla iç içe çay ve kahve keyfi.", cat: "kahve", price: 1, rating: 4.1, reviews: 88 },
  { name: "Bitlis Kitap & Kahve", desc: "Sessiz çalışma alanı ve zengin kütüphanesiyle kültürel bir mekan.", cat: "kahve", price: 2, rating: 4.7, reviews: 64 },
  { name: "Çarşıbaşı Espresso", desc: "Çarşı girişinde küçük ama kaliteli espresso bar.", cat: "kahve", price: 1, rating: 4.0, reviews: 53 },
  { name: "Nur Caddesi Kahvecisi", desc: "Otantik Bitlis kahvesi ve menengiç kahvesi sunan geleneksel kahvehane.", cat: "kahve", price: 1, rating: 4.2, reviews: 190 },
  { name: "Eski Saray Cafe", desc: "Eski Saray Caddesi'nin en köklü kafesi. Nostalji dolu iç mekan.", cat: "kahve", price: 2, rating: 4.5, reviews: 215 },
  { name: "Vadi Seyir Cafe", desc: "Bitlis vadisine bakan teraslı kafe. Gün batımı manzarası eşsiz.", cat: "kahve", price: 3, rating: 4.8, reviews: 78 },
  { name: "Taş Köprü Nargile", desc: "Tarihi taş köprü yakınında nargile ve çay keyfi.", cat: "kahve", price: 1, rating: 3.9, reviews: 95 },
  // 🍽️ Restoranlar
  { name: "Bitlis Büryan Evi", desc: "Bitlis'in meşhur büryan kebabını odun ateşinde geleneksel yöntemle pişiren efsane.", cat: "restoran", price: 2, rating: 4.9, reviews: 380 },
  { name: "Merkez Pide Fırını", desc: "Taş fırında pişen Bitlis pidesi ve lahmacun. Bölgenin en sevilen fırını.", cat: "restoran", price: 1, rating: 4.6, reviews: 275 },
  { name: "Dere Boyu Restaurant", desc: "Bitlis Deresi kenarında yöresel lezzetler sunan aile restoranı.", cat: "restoran", price: 2, rating: 4.3, reviews: 195 },
  { name: "Nur Kebapçısı", desc: "Adana, urfa ve patlıcan kebap çeşitleri ile Bitlis'in kebap ustası.", cat: "restoran", price: 2, rating: 4.5, reviews: 198 },
  { name: "Bitlis Çiğ Köfte", desc: "Acısız çiğ köfte dürüm, ayran ve salata eşliğinde hafif bir öğün.", cat: "restoran", price: 1, rating: 4.0, reviews: 65 },
  { name: "Sultan Sofrası Bitlis", desc: "Osmanlı mutfağından ilham alan zengin menü. Bitlis'in en şık restoranı.", cat: "restoran", price: 3, rating: 4.5, reviews: 155 },
  { name: "Şerefiye Ev Yemekleri", desc: "Ev yapımı yöresel yemekler. Her gün taze hazırlanan menü.", cat: "restoran", price: 1, rating: 4.4, reviews: 162 },
  { name: "Bitlis Döner & Izgara", desc: "El yapımı döner, iskender ve karışık ızgara tabakları.", cat: "restoran", price: 1, rating: 4.2, reviews: 170 },
  { name: "Kahvaltı Konağı Bitlis", desc: "Serpme kahvaltı, Van otlu peyniri, kaymak-bal ve taze ekmek.", cat: "restoran", price: 2, rating: 4.8, reviews: 230 },
  { name: "Merkez Balık Evi", desc: "Alabalık ızgara ve Van Gölü inci kefalinin en lezzetli hali.", cat: "restoran", price: 3, rating: 4.7, reviews: 112 },
];

// ─── Görseller ───
const CAFE_IMG = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
];
const REST_IMG = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
];

const AMENITIES = [["wifi","priz"],["wifi"],["wifi","priz","bahce"],["bahce","otopark"],["wifi","bahce"],["otopark"],[]];

function buildDocs(list, centerLng, centerLat, userId) {
  return list.map((m) => ({
    name: m.name,
    description: m.desc,
    category: m.cat,          // "kahve" veya "restoran" — Place.js enum'a birebir uyumlu
    priceLevel: m.price,
    averageRating: m.rating,
    totalReviews: m.reviews,
    location: {
      type: "Point",
      coordinates: scatter(centerLng, centerLat),  // [LONGITUDE, LATITUDE]
    },
    address: { street: "", district: "Merkez", city: "Bitlis" },
    amenities: AMENITIES[Math.floor(Math.random() * AMENITIES.length)],
    images: [
      (m.cat === "kahve" ? CAFE_IMG : REST_IMG)[Math.floor(Math.random() * 5)],
    ],
    createdBy: userId,
    isUserAdded: false,
    isActive: true,
  }));
}

// ═══════════════════════════════════════════════════════════
// 🚀 ANA SEED FONKSİYONU
// ═══════════════════════════════════════════════════════════
async function seed() {
  try {
    const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(URI);
    console.log("✅ MongoDB bağlantısı başarılı.\n");

    // ════════════════════════════════════
    // 🗑️  ADIM 1 — KOMPLETemizlik
    // ════════════════════════════════════
    const del = await Place.deleteMany({});
    console.log(`🗑️  ${del.deletedCount} eski mekan silindi. Veritabanı SIFIR.`);

    // İndeks yenile
    try { await Place.collection.dropIndexes(); } catch (_) {}
    await Place.ensureIndexes();
    console.log("✅ 2dsphere indeksi yeniden oluşturuldu.\n");

    // ════════════════════════════════════
    // 👤 ADIM 2 — Kullanıcı bul
    // ════════════════════════════════════
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) { console.error("❌ Kullanıcı yok!"); process.exit(1); }
    console.log(`👤 Sahip: "${user.name}" (${user.email})\n`);

    // ════════════════════════════════════
    // 📍 ADIM 3a — TATVAN MEKANLARI
    //    Merkez: Lng=42.285  Lat=38.503
    // ════════════════════════════════════
    const tatvanDocs = buildDocs(TATVAN, 42.285, 38.503, user._id);
    const tatvanResult = await Place.insertMany(tatvanDocs);
    console.log(`🏔️  TATVAN — ${tatvanResult.length} mekan eklendi:`);
    tatvanResult.forEach((p) => {
      const [lng, lat] = p.location.coordinates;
      console.log(`   ✅ "${p.name}" [${p.category}] → [Lng:${lng}, Lat:${lat}]`);
    });

    // ════════════════════════════════════
    // 📍 ADIM 3b — BİTLİS MERKEZ MEKANLARI
    //    Merkez: Lng=42.108  Lat=38.394
    // ════════════════════════════════════
    const bitlisDocs = buildDocs(BITLIS_MERKEZ, 42.108, 38.394, user._id);
    const bitlisResult = await Place.insertMany(bitlisDocs);
    console.log(`\n🏛️  BİTLİS MERKEZ — ${bitlisResult.length} mekan eklendi:`);
    bitlisResult.forEach((p) => {
      const [lng, lat] = p.location.coordinates;
      console.log(`   ✅ "${p.name}" [${p.category}] → [Lng:${lng}, Lat:${lat}]`);
    });

    // ════════════════════════════════════
    // 🔍 ADIM 4 — DOĞRULAMA
    // ════════════════════════════════════
    const total = await Place.countDocuments();
    console.log(`\n${"═".repeat(60)}`);
    console.log(`🎉 SEED TAMAMLANDI!`);
    console.log(`   🏔️  Tatvan:       ${tatvanResult.length} mekan  [42.285, 38.503]`);
    console.log(`   🏛️  Bitlis Merkez: ${bitlisResult.length} mekan  [42.108, 38.394]`);
    console.log(`   📊 Toplam:        ${total} mekan`);
    console.log(`${"═".repeat(60)}`);

    // GeoNear doğrulama — Tatvan
    const testTatvan = await Place.aggregate([
      { $geoNear: { near: { type: "Point", coordinates: [42.285, 38.503] }, distanceField: "d", maxDistance: 5000, spherical: true } },
    ]);
    console.log(`\n🔍 Tatvan GeoNear (5km):  ${testTatvan.length} mekan bulundu`);

    // GeoNear doğrulama — Bitlis Merkez
    const testBitlis = await Place.aggregate([
      { $geoNear: { near: { type: "Point", coordinates: [42.108, 38.394] }, distanceField: "d", maxDistance: 5000, spherical: true } },
    ]);
    console.log(`🔍 Bitlis GeoNear (5km):  ${testBitlis.length} mekan bulundu`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ HATA:", err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();
