import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";

// ═══════════════════════════════════════════════════════════
// 📍 Bitlis Merkez (Şerefiye / Gökmeydan) — Seed Data
//    Merkez Koordinat: Lat 38.394, Lng 42.108
//    Eski Saray Caddesi, Nur Caddesi ve çevresi
//    15 Kafe + 15 Restoran = 30 Mekan
//    Koordinatlar: [Longitude, Latitude] (MongoDB GeoJSON)
// ═══════════════════════════════════════════════════════════

const BITLIS_MERKEZ_DATA = [
  // ═══════════════════════════════════
  // ☕ KAFELER (15 Adet)
  // ═══════════════════════════════════
  {
    name: "Şerefiye Kahve Durağı",
    description: "Şerefiye mahallesinin kalbinde, samimi atmosferiyle öğrenci ve esnafın vazgeçilmez buluşma noktası.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.3,
    totalReviews: 142,
    location: { type: "Point", coordinates: [42.1082, 38.3942] },
    address: { street: "Şerefiye Caddesi", district: "Şerefiye", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Gökmeydan Cafe & Lounge",
    description: "Gökmeydan'ın en modern kafesi. 3. dalga filtre kahve, cold brew ve espresso çeşitleri.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.6,
    totalReviews: 98,
    location: { type: "Point", coordinates: [42.1095, 38.3955] },
    address: { street: "Gökmeydan Mahallesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "priz", "bahce"],
  },
  {
    name: "Nur Caddesi Coffee House",
    description: "Nur Caddesi üzerinde şık dekorasyonu ve özel çekilmiş Türk kahvesiyle bilinen mekan.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.4,
    totalReviews: 176,
    location: { type: "Point", coordinates: [42.1068, 38.3935] },
    address: { street: "Nur Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Eski Saray Kafe",
    description: "Eski Saray Caddesi'nin en köklü kafesi. Nostalji dolu iç mekan ve taze pastane ürünleri.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.5,
    totalReviews: 215,
    location: { type: "Point", coordinates: [42.1075, 38.3928] },
    address: { street: "Eski Saray Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi"],
  },
  {
    name: "Huzur Çay Bahçesi",
    description: "Bitlis Merkez'de doğa içinde, çay ve nargile keyfi sunan geleneksel bahçe.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.1,
    totalReviews: 88,
    location: { type: "Point", coordinates: [42.1105, 38.3960] },
    address: { street: "Huzur Sokak", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["bahce", "otopark"],
  },
  {
    name: "Merkez Kitap & Kahve",
    description: "Kitap okuyarak kahve içebileceğiniz kültürel bir mekan. Sessiz çalışma alanı mevcut.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.7,
    totalReviews: 64,
    location: { type: "Point", coordinates: [42.1058, 38.3948] },
    address: { street: "Cumhuriyet Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Taş Köprü Cafe",
    description: "Tarihi taş köprü yakınında manzaralı kafe. Bitlis'in doğal güzelliğine açılan pencere.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.3,
    totalReviews: 130,
    location: { type: "Point", coordinates: [42.1112, 38.3920] },
    address: { street: "Köprübaşı", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "bahce"],
  },
  {
    name: "Dere Kenarı Çay Evi",
    description: "Bitlis Deresi kenarında ferah atmosferiyle huzurlu bir çay molası.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 3.9,
    totalReviews: 72,
    location: { type: "Point", coordinates: [42.1090, 38.3912] },
    address: { street: "Dere Boyu", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce"],
  },
  {
    name: "Çarşı İçi Espresso Bar",
    description: "Çarşı içinde mini espresso bar. Hızlı kahve alıp yolunuza devam edin.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.0,
    totalReviews: 53,
    location: { type: "Point", coordinates: [42.1072, 38.3918] },
    address: { street: "Çarşı İçi", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Hilal Cafe Studio",
    description: "Genç girişimcilerin işlettiği modern kafe. Latte art ve cheesecake ile ünlü.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.5,
    totalReviews: 110,
    location: { type: "Point", coordinates: [42.1062, 38.3958] },
    address: { street: "Hilal Sokak", district: "Şerefiye", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Bitlis Kahvecisi",
    description: "Otantik Bitlis kahvesi ve menengiç kahvesi sunan geleneksel kahvehane.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 4.2,
    totalReviews: 190,
    location: { type: "Point", coordinates: [42.1098, 38.3930] },
    address: { street: "Atatürk Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi"],
  },
  {
    name: "Yeşil Vadi Cafe",
    description: "Bitlis vadisin​e bakan teraslı kafe. Gün batımı manzarası eşsiz.",
    category: "kahve",
    priceLevel: 3,
    averageRating: 4.8,
    totalReviews: 78,
    location: { type: "Point", coordinates: [42.1118, 38.3945] },
    address: { street: "Vadi Yolu", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["wifi", "bahce", "otopark"],
  },
  {
    name: "Saat Kulesi Cafe",
    description: "Saat Kulesi yakınında tarihi dokuyla iç içe bir kafe deneyimi.",
    category: "kahve",
    priceLevel: 2,
    averageRating: 4.4,
    totalReviews: 145,
    location: { type: "Point", coordinates: [42.1055, 38.3925] },
    address: { street: "Saat Kulesi Meydanı", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "priz"],
  },
  {
    name: "Dostlar Nargile Cafe",
    description: "Arkadaş grupları için ideal, geniş oturma alanı ve çeşitli nargile seçenekleri.",
    category: "kahve",
    priceLevel: 1,
    averageRating: 3.8,
    totalReviews: 95,
    location: { type: "Point", coordinates: [42.1088, 38.3965] },
    address: { street: "Dostlar Sokak", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["wifi", "bahce"],
  },
  {
    name: "Meydan Cafe Premium",
    description: "Gökmeydan'ın en yeni premium kafesi. İtalyan espresso makinesi ve ev yapımı tatlılar.",
    category: "kahve",
    priceLevel: 3,
    averageRating: 4.6,
    totalReviews: 42,
    location: { type: "Point", coordinates: [42.1078, 38.3952] },
    address: { street: "Meydan Caddesi", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["wifi", "priz", "bahce"],
  },

  // ═══════════════════════════════════
  // 🍽️ RESTORANLAR (15 Adet)
  // ═══════════════════════════════════
  {
    name: "Merkez Büryan Kebap Salonu",
    description: "Bitlis'in meşhur büryan kebabını odun ateşinde geleneksel yöntemle pişiren efsane mekan.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.9,
    totalReviews: 380,
    location: { type: "Point", coordinates: [42.1070, 38.3940] },
    address: { street: "Eski Saray Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Gökmeydan Pide Fırını",
    description: "Taş fırında pişen Bitlis pidesi ve lahmacunuyla bölgenin en sevilen fırını.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.6,
    totalReviews: 275,
    location: { type: "Point", coordinates: [42.1100, 38.3950] },
    address: { street: "Gökmeydan Ana Cadde", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["otopark"],
  },
  {
    name: "Şerefiye Sofrası",
    description: "Ev yemekleri konseptinde, her gün taze hazırlanan yöresel Bitlis mutfağı.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.4,
    totalReviews: 162,
    location: { type: "Point", coordinates: [42.1085, 38.3938] },
    address: { street: "Şerefiye Caddesi", district: "Şerefiye", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Nur Caddesi Kebapçısı",
    description: "Adana ve Urfa kebap çeşitleri, patlıcan kebap ve beyti sarma ile ünlü.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.5,
    totalReviews: 198,
    location: { type: "Point", coordinates: [42.1065, 38.3932] },
    address: { street: "Nur Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Anadolu Lezzet Durağı",
    description: "Karışık ızgara, kuzu tandır ve kelle paça ile Anadolu mutfağının en iyileri.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.3,
    totalReviews: 135,
    location: { type: "Point", coordinates: [42.1092, 38.3922] },
    address: { street: "İstasyon Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["otopark"],
  },
  {
    name: "Çarşıbaşı Tantuni & Dürüm",
    description: "Mersin tantuni, tavuk dürüm ve çiğ köfte rulolarıyla hızlı ve leziz.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.1,
    totalReviews: 88,
    location: { type: "Point", coordinates: [42.1078, 38.3915] },
    address: { street: "Çarşıbaşı", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Bitlis Balık Evi",
    description: "Van Gölü'nden taze inci kefali ve alabalık ızgara sunan balık restoranı.",
    category: "restoran",
    priceLevel: 3,
    averageRating: 4.7,
    totalReviews: 112,
    location: { type: "Point", coordinates: [42.1115, 38.3935] },
    address: { street: "Vadi Yolu", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce", "otopark"],
  },
  {
    name: "Sultan Sofrası",
    description: "Osmanlı mutfağından ilham alan zengin menüsüyle Bitlis'in en şık restoranı.",
    category: "restoran",
    priceLevel: 3,
    averageRating: 4.5,
    totalReviews: 155,
    location: { type: "Point", coordinates: [42.1060, 38.3945] },
    address: { street: "Cumhuriyet Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi", "otopark"],
  },
  {
    name: "Kazan Kebap Merkez",
    description: "Kazan kebabı ve kuzu kavurma gibi yöresel etli yemeklerin ustası.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.4,
    totalReviews: 205,
    location: { type: "Point", coordinates: [42.1102, 38.3925] },
    address: { street: "Atatürk Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Köşebaşı Döner & Izgara",
    description: "El yapımı döner, iskender ve karışık ızgara tabakları. Öğle yemeği favorisi.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.2,
    totalReviews: 170,
    location: { type: "Point", coordinates: [42.1073, 38.3960] },
    address: { street: "Meydan Caddesi", district: "Gökmeydan", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Hanedan Aile Restoranı",
    description: "Geniş aileler için ideal, çocuk oyun alanı ve zengin menü seçenekleri.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.3,
    totalReviews: 142,
    location: { type: "Point", coordinates: [42.1110, 38.3955] },
    address: { street: "Hanedan Sokak", district: "Gökmeydan", city: "Bitlis" },
    amenities: ["bahce", "otopark", "hayvan-dostu"],
  },
  {
    name: "Dereboyu Alabalık Tesisi",
    description: "Bitlis Deresi kenarında taze alabalık ve Van kahvaltısı sunan huzurlu mekan.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.6,
    totalReviews: 195,
    location: { type: "Point", coordinates: [42.1095, 38.3908] },
    address: { street: "Dere Boyu", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce", "otopark"],
  },
  {
    name: "Bitlis Çiğ Köfte Dünyası",
    description: "Acısız çiğ köfte dürüm, ayran ve salata eşliğinde hafif bir öğün.",
    category: "restoran",
    priceLevel: 1,
    averageRating: 4.0,
    totalReviews: 65,
    location: { type: "Point", coordinates: [42.1068, 38.3968] },
    address: { street: "Şerefiye Caddesi", district: "Şerefiye", city: "Bitlis" },
    amenities: [],
  },
  {
    name: "Yörem Kahvaltı Salonu",
    description: "Serpme kahvaltı, Van otlu peyniri, kaymak-bal ve taze tandır ekmeği.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.8,
    totalReviews: 230,
    location: { type: "Point", coordinates: [42.1052, 38.3938] },
    address: { street: "İstasyon Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["bahce", "otopark"],
  },
  {
    name: "Lezzet Sarayı Pizza & Burger",
    description: "Gençlerin tercihi: El yapımı burger, pizza çeşitleri ve patates kızartması.",
    category: "restoran",
    priceLevel: 2,
    averageRating: 4.1,
    totalReviews: 92,
    location: { type: "Point", coordinates: [42.1088, 38.3948] },
    address: { street: "Nur Caddesi", district: "Merkez", city: "Bitlis" },
    amenities: ["wifi"],
  },
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
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
];

async function seedBitlisMerkez() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı.");

    // Kullanıcı bul (mekanları sahiplendirmek için)
    let user = await User.findOne({ email: "ahmet@test.com" });
    if (!user) user = await User.findOne();
    if (!user) {
      console.error("❌ Kullanıcı bulunamadı! Önce bir kullanıcı oluşturun.");
      process.exit(1);
    }
    console.log(`👤 Mekanlar "${user.name}" adına eklenecek.\n`);

    let added = 0;
    let skipped = 0;

    for (const place of BITLIS_MERKEZ_DATA) {
      // Zaten varsa atla
      const exists = await Place.findOne({ name: place.name });
      if (exists) {
        console.log(`  ⏩ "${place.name}" zaten mevcut, atlanıyor.`);
        skipped++;
        continue;
      }

      // Kategoriye göre görsel seç
      const images = place.category === "kahve" ? CAFE_IMAGES : RESTORAN_IMAGES;
      const randomImage = images[Math.floor(Math.random() * images.length)];

      await Place.create({
        ...place,
        images: [randomImage],
        createdBy: user._id,
        isUserAdded: false,
        isActive: true,
      });
      console.log(`  ✅ "${place.name}" eklendi. [${place.category}]`);
      added++;
    }

    console.log(`\n${"═".repeat(50)}`);
    console.log(`🎉 Bitlis Merkez seed tamamlandı!`);
    console.log(`   ✅ ${added} yeni mekan eklendi`);
    console.log(`   ⏩ ${skipped} mekan zaten mevcuttu`);
    const total = await Place.countDocuments();
    console.log(`   📊 Veritabanında toplam ${total} mekan var.`);
    console.log(`${"═".repeat(50)}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed hatası:", err.message);
    process.exit(1);
  }
}

seedBitlisMerkez();
