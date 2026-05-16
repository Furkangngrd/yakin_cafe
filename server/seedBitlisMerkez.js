import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 Rahva / Beş Minare Yerleşkesi — TEMİZ SEED
//    Merkez: Lat 38.412, Lng 42.115
//    ÖNCELİKLE TÜM ESKİ VERİLERİ SİLER, SONRA YENİ EKLER
//    Kategoriler: "kahve" ve "restoran" (Place.js enum'a birebir uyumlu)
//    Koordinat formatı: [longitude, latitude] (GeoJSON)
// ═══════════════════════════════════════════════════════════

// Merkez nokta
const CENTER_LAT = 38.412;
const CENTER_LNG = 42.115;

// Rastgele koordinat üretici (merkezden ±0.005 ~ 500m, ±0.015 ~ 1.5km)
function randomCoord(baseLng, baseLat, spreadLng = 0.012, spreadLat = 0.008) {
  const lng = baseLng + (Math.random() - 0.5) * 2 * spreadLng;
  const lat = baseLat + (Math.random() - 0.5) * 2 * spreadLat;
  return [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))];
}

// ─── 15 Kafe ───
const KAFELER = [
  { name: "Şerefiye Kahve Durağı", description: "Şerefiye mahallesinin kalbinde, samimi atmosferiyle vazgeçilmez buluşma noktası.", priceLevel: 1, averageRating: 4.3, totalReviews: 142 },
  { name: "Gökmeydan Cafe & Lounge", description: "Gökmeydan'ın en modern kafesi. 3. dalga filtre kahve ve cold brew.", priceLevel: 2, averageRating: 4.6, totalReviews: 98 },
  { name: "Nur Caddesi Coffee House", description: "Nur Caddesi üzerinde şık dekorasyonu ve özel çekilmiş Türk kahvesiyle bilinen mekan.", priceLevel: 2, averageRating: 4.4, totalReviews: 176 },
  { name: "Eski Saray Kafe", description: "Eski Saray Caddesi'nin en köklü kafesi. Nostalji dolu iç mekan ve taze pastane ürünleri.", priceLevel: 2, averageRating: 4.5, totalReviews: 215 },
  { name: "Huzur Çay Bahçesi", description: "Bitlis Merkez'de doğa içinde, çay ve nargile keyfi sunan geleneksel bahçe.", priceLevel: 1, averageRating: 4.1, totalReviews: 88 },
  { name: "Merkez Kitap & Kahve", description: "Kitap okuyarak kahve içebileceğiniz kültürel mekan. Sessiz çalışma alanı mevcut.", priceLevel: 2, averageRating: 4.7, totalReviews: 64 },
  { name: "Taş Köprü Cafe", description: "Tarihi taş köprü yakınında manzaralı kafe. Bitlis'in doğal güzelliğine açılan pencere.", priceLevel: 2, averageRating: 4.3, totalReviews: 130 },
  { name: "Dere Kenarı Çay Evi", description: "Bitlis Deresi kenarında ferah atmosferiyle huzurlu bir çay molası.", priceLevel: 1, averageRating: 3.9, totalReviews: 72 },
  { name: "Çarşı İçi Espresso Bar", description: "Çarşı içinde mini espresso bar. Hızlı kahve alıp yolunuza devam edin.", priceLevel: 1, averageRating: 4.0, totalReviews: 53 },
  { name: "Hilal Cafe Studio", description: "Genç girişimcilerin işlettiği modern kafe. Latte art ve cheesecake ile ünlü.", priceLevel: 2, averageRating: 4.5, totalReviews: 110 },
  { name: "Bitlis Kahvecisi", description: "Otantik Bitlis kahvesi ve menengiç kahvesi sunan geleneksel kahvehane.", priceLevel: 1, averageRating: 4.2, totalReviews: 190 },
  { name: "Yeşil Vadi Cafe", description: "Bitlis vadisine bakan teraslı kafe. Gün batımı manzarası eşsiz.", priceLevel: 3, averageRating: 4.8, totalReviews: 78 },
  { name: "Saat Kulesi Cafe", description: "Saat Kulesi yakınında tarihi dokuyla iç içe bir kafe deneyimi.", priceLevel: 2, averageRating: 4.4, totalReviews: 145 },
  { name: "Dostlar Nargile Cafe", description: "Geniş oturma alanı ve çeşitli nargile seçenekleri ile arkadaş gruplarına ideal.", priceLevel: 1, averageRating: 3.8, totalReviews: 95 },
  { name: "Meydan Cafe Premium", description: "Gökmeydan'ın en yeni premium kafesi. İtalyan espresso ve ev yapımı tatlılar.", priceLevel: 3, averageRating: 4.6, totalReviews: 42 },
];

// ─── 15 Restoran ───
const RESTORANLAR = [
  { name: "Merkez Büryan Kebap Salonu", description: "Bitlis'in meşhur büryan kebabını odun ateşinde geleneksel yöntemle pişiren efsane mekan.", priceLevel: 2, averageRating: 4.9, totalReviews: 380 },
  { name: "Gökmeydan Pide Fırını", description: "Taş fırında pişen Bitlis pidesi ve lahmacunuyla bölgenin en sevilen fırını.", priceLevel: 1, averageRating: 4.6, totalReviews: 275 },
  { name: "Şerefiye Sofrası", description: "Ev yemekleri konseptinde, her gün taze hazırlanan yöresel Bitlis mutfağı.", priceLevel: 1, averageRating: 4.4, totalReviews: 162 },
  { name: "Nur Caddesi Kebapçısı", description: "Adana ve Urfa kebap çeşitleri, patlıcan kebap ve beyti sarma ile ünlü.", priceLevel: 2, averageRating: 4.5, totalReviews: 198 },
  { name: "Anadolu Lezzet Durağı", description: "Karışık ızgara, kuzu tandır ve kelle paça ile Anadolu mutfağının en iyileri.", priceLevel: 2, averageRating: 4.3, totalReviews: 135 },
  { name: "Çarşıbaşı Tantuni & Dürüm", description: "Mersin tantuni, tavuk dürüm ve çiğ köfte rulolarıyla hızlı ve leziz.", priceLevel: 1, averageRating: 4.1, totalReviews: 88 },
  { name: "Bitlis Balık Evi", description: "Van Gölü'nden taze inci kefali ve alabalık ızgara sunan balık restoranı.", priceLevel: 3, averageRating: 4.7, totalReviews: 112 },
  { name: "Sultan Sofrası", description: "Osmanlı mutfağından ilham alan zengin menüsüyle Bitlis'in en şık restoranı.", priceLevel: 3, averageRating: 4.5, totalReviews: 155 },
  { name: "Kazan Kebap Merkez", description: "Kazan kebabı ve kuzu kavurma gibi yöresel etli yemeklerin ustası.", priceLevel: 2, averageRating: 4.4, totalReviews: 205 },
  { name: "Köşebaşı Döner & Izgara", description: "El yapımı döner, iskender ve karışık ızgara tabakları.", priceLevel: 1, averageRating: 4.2, totalReviews: 170 },
  { name: "Hanedan Aile Restoranı", description: "Geniş aileler için ideal, çocuk oyun alanı ve zengin menü seçenekleri.", priceLevel: 2, averageRating: 4.3, totalReviews: 142 },
  { name: "Dereboyu Alabalık Tesisi", description: "Bitlis Deresi kenarında taze alabalık ve Van kahvaltısı sunan huzurlu mekan.", priceLevel: 2, averageRating: 4.6, totalReviews: 195 },
  { name: "Bitlis Çiğ Köfte Dünyası", description: "Acısız çiğ köfte dürüm, ayran ve salata eşliğinde hafif bir öğün.", priceLevel: 1, averageRating: 4.0, totalReviews: 65 },
  { name: "Yörem Kahvaltı Salonu", description: "Serpme kahvaltı, Van otlu peyniri, kaymak-bal ve taze tandır ekmeği.", priceLevel: 2, averageRating: 4.8, totalReviews: 230 },
  { name: "Lezzet Sarayı Pizza & Burger", description: "Gençlerin tercihi: El yapımı burger, pizza çeşitleri ve patates kızartması.", priceLevel: 2, averageRating: 4.1, totalReviews: 92 },
];

// Unsplash görselleri
const CAFE_IMAGES = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
];

const RESTORAN_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
];

const AMENITIES_POOL = [
  ["wifi", "priz"],
  ["wifi"],
  ["wifi", "priz", "bahce"],
  ["bahce", "otopark"],
  ["wifi", "bahce"],
  ["otopark"],
  [],
];

async function seedClean() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı.\n");

    // ═══════════════════════════════════
    // 🗑️ 1. ADIM: TÜM ESKİ VERİLERİ SİL
    // ═══════════════════════════════════
    const deletedCount = await Place.deleteMany({});
    console.log(`🗑️  ${deletedCount.deletedCount} eski mekan silindi.`);

    // 2dsphere indeksini yeniden oluştur (bozuk indeks ihtimaline karşı)
    try {
      await Place.collection.dropIndexes();
      console.log("🔄 Eski indeksler temizlendi.");
    } catch (e) {
      // İlk çalıştırmada indeks yoksa hata verebilir, sorun değil
    }
    await Place.ensureIndexes();
    console.log("✅ 2dsphere indeksi yeniden oluşturuldu.\n");

    // ═══════════════════════════════════
    // 👤 Kullanıcı bul (createdBy için)
    // ═══════════════════════════════════
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) {
      console.error("❌ Kullanıcı bulunamadı! Önce bir kullanıcı kaydı oluşturun.");
      process.exit(1);
    }
    console.log(`👤 Mekanlar "${user.name}" (${user.email}) adına eklenecek.\n`);

    // ═══════════════════════════════════
    // ☕ 2. ADIM: KAFELER EKLE (15 adet)
    // ═══════════════════════════════════
    const cafeDocuments = KAFELER.map((cafe) => ({
      name: cafe.name,
      description: cafe.description,
      category: "kahve",  // ← Place.js enum: "kahve"
      priceLevel: cafe.priceLevel,
      averageRating: cafe.averageRating,
      totalReviews: cafe.totalReviews,
      location: {
        type: "Point",
        coordinates: randomCoord(CENTER_LNG, CENTER_LAT),
      },
      address: { street: "", district: "Merkez", city: "Bitlis" },
      amenities: AMENITIES_POOL[Math.floor(Math.random() * AMENITIES_POOL.length)],
      images: [CAFE_IMAGES[Math.floor(Math.random() * CAFE_IMAGES.length)]],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const insertedCafes = await Place.insertMany(cafeDocuments);
    console.log(`☕ ${insertedCafes.length} kafe eklendi:`);
    insertedCafes.forEach((c) => {
      const [lng, lat] = c.location.coordinates;
      console.log(`   ✅ "${c.name}" → [${lng}, ${lat}]`);
    });

    // ═══════════════════════════════════
    // 🍽️ 3. ADIM: RESTORANLAR EKLE (15 adet)
    // ═══════════════════════════════════
    const restoranDocuments = RESTORANLAR.map((rest) => ({
      name: rest.name,
      description: rest.description,
      category: "restoran",  // ← Place.js enum: "restoran"
      priceLevel: rest.priceLevel,
      averageRating: rest.averageRating,
      totalReviews: rest.totalReviews,
      location: {
        type: "Point",
        coordinates: randomCoord(CENTER_LNG, CENTER_LAT),
      },
      address: { street: "", district: "Merkez", city: "Bitlis" },
      amenities: AMENITIES_POOL[Math.floor(Math.random() * AMENITIES_POOL.length)],
      images: [RESTORAN_IMAGES[Math.floor(Math.random() * RESTORAN_IMAGES.length)]],
      createdBy: user._id,
      isUserAdded: false,
      isActive: true,
    }));

    const insertedRestorans = await Place.insertMany(restoranDocuments);
    console.log(`\n🍽️  ${insertedRestorans.length} restoran eklendi:`);
    insertedRestorans.forEach((r) => {
      const [lng, lat] = r.location.coordinates;
      console.log(`   ✅ "${r.name}" → [${lng}, ${lat}]`);
    });

    // ═══════════════════════════════════
    // 📊 SONUÇ
    // ═══════════════════════════════════
    const totalPlaces = await Place.countDocuments();
    console.log(`\n${"═".repeat(55)}`);
    console.log(`🎉 TEMİZ SEED TAMAMLANDI!`);
    console.log(`   📍 Merkez: Lat ${CENTER_LAT}, Lng ${CENTER_LNG} (Rahva)`);
    console.log(`   ☕ ${insertedCafes.length} kafe (category: "kahve")`);
    console.log(`   🍽️  ${insertedRestorans.length} restoran (category: "restoran")`);
    console.log(`   📊 Veritabanında toplam ${totalPlaces} mekan.`);
    console.log(`${"═".repeat(55)}`);

    // Doğrulama: GeoNear sorgusu dene
    console.log(`\n🔍 Doğrulama: ${CENTER_LAT}, ${CENTER_LNG} çevresinde 15km arama...`);
    const testResults = await Place.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [CENTER_LNG, CENTER_LAT] },
          distanceField: "distance",
          maxDistance: 15000,
          spherical: true,
        },
      },
    ]);
    console.log(`   ✅ GeoNear sorgusu ${testResults.length} mekan buldu!`);

    if (testResults.length === 0) {
      console.error("   ❌ UYARI: GeoNear sorgusu mekan bulamadı! 2dsphere indeksi kontrol edin.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed hatası:", err.message);
    console.error(err);
    process.exit(1);
  }
}

seedClean();
