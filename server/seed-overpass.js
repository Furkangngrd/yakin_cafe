import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";
import Review from "./src/models/Review.js";

// Unsplash'ten rastgele şık kafe ve restoran görselleri
const KAFE_GORSELLERI = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80"
];

// Overpass API Ayarları
const LAT = 38.5052; // Tatvan, Bitlis Enlem
const LON = 42.2801; // Tatvan, Bitlis Boylam
const RADIUS = 5000; // 5 KM
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OVERPASS_QUERY = `
  [out:json][timeout:25];
  (
    node["amenity"~"cafe|restaurant|fast_food|bar|pub"](around:${RADIUS}, ${LAT}, ${LON});
  );
  out body;
`;

// ─── Tatvan / Bitlis Fallback Mekanları ────────
const FALLBACK_PLACES = [
  { name: "Tatvan Sahil Kafe", description: "Nemrut Krater Gölü manzarasına yakın, Van Gölü kenarında huzurlu bir kafe.", category: "kahve", coords: [42.2815, 38.5065], priceLevel: 2, rating: 4.5, reviews: 142 },
  { name: "Göl Manzara Restaurant", description: "Van Gölü'nün muhteşem manzarasında yöresel lezzetler.", category: "restoran", coords: [42.2790, 38.5030], priceLevel: 3, rating: 4.7, reviews: 210 },
  { name: "Tatvan Çarşı Lokantası", description: "Geleneksel Bitlis mutfağından enfes yemekler sunan aile restoranı.", category: "restoran", coords: [42.2830, 38.5050], priceLevel: 2, rating: 4.3, reviews: 180 },
  { name: "Café Nemrut", description: "Modern dekorasyonuyla Tatvan'ın en popüler çalışma ve buluşma noktası.", category: "kahve", coords: [42.2780, 38.5070], priceLevel: 3, rating: 4.6, reviews: 95 },
  { name: "Bitlis Tatlıcısı", description: "Yöresel Bitlis tatlıları ve dondurma. Büryan kebabı da mevcuttur.", category: "tatli", coords: [42.2825, 38.5040], priceLevel: 2, rating: 4.8, reviews: 320 },
  { name: "Van Gölü Balık Evi", description: "Taze inci kefali ve alabalık çeşitleriyle meşhur balık restoranı.", category: "restoran", coords: [42.2760, 38.5085], priceLevel: 3, rating: 4.4, reviews: 175 },
  { name: "Sahil Çay Bahçesi", description: "Göl kenarında çay ve nargile keyfi, geniş bahçe alanı.", category: "kahve", coords: [42.2850, 38.5020], priceLevel: 1, rating: 4.2, reviews: 88 },
  { name: "Tatvan Büryan Sofrası", description: "Bitlis'in ünlü büryan kebabını en otantik haliyle sunan mekan.", category: "restoran", coords: [42.2810, 38.5055], priceLevel: 2, rating: 4.9, reviews: 420 },
  { name: "Kampüs Coffee Lab", description: "Öğrencilere özel fiyatlarla 3. dalga kahve deneyimi.", category: "kahve", coords: [42.2870, 38.5035], priceLevel: 2, rating: 4.1, reviews: 65 },
  { name: "Süphan Pastanesi", description: "Geleneksel Bitlis küncülü helvası ve pastacılık ürünleri.", category: "tatli", coords: [42.2795, 38.5060], priceLevel: 2, rating: 4.5, reviews: 230 },
  { name: "Göl Kenarı Bistro", description: "Batı mutfağı ve Anadolu lezzetlerinin buluştuğu şık mekan.", category: "restoran", coords: [42.2740, 38.5090], priceLevel: 4, rating: 4.3, reviews: 110 },
  { name: "Tatvan Pub & Lounge", description: "Canlı müzik ve spor yayınlarıyla sosyal buluşma noktası.", category: "bar", coords: [42.2820, 38.5045], priceLevel: 3, rating: 4.0, reviews: 72 },
  { name: "Çalışma Evi Coworking", description: "Hızlı WiFi, sessiz odalar ve toplantı alanlarıyla ideal çalışma mekanı.", category: "calisma-alani", coords: [42.2835, 38.5075], priceLevel: 2, rating: 4.6, reviews: 48 },
  { name: "Ahlat Yolu Kebapçısı", description: "Odun ateşinde hazırlanan kebaplar ve taze pide.", category: "restoran", coords: [42.2805, 38.5025], priceLevel: 2, rating: 4.7, reviews: 290 },
  { name: "Nemrut Waffle House", description: "Waffle, krep ve taze meyve suyu çeşitleri.", category: "tatli", coords: [42.2845, 38.5080], priceLevel: 2, rating: 4.2, reviews: 55 },
];

// ═══════════════════════════════════════════════════════════
// 🌱 Seeder — Kullanıcıları KORUYARAK sadece mekanları günceller
//    • Kayıtlı kullanıcılar SİLİNMEZ (Auth Persistence)
//    • Demo kullanıcılar yoksa oluşturulur (upsert mantığı)
//    • Mekanlar ve reviewlar her seferinde temizlenip yeniden oluşturulur
// ═══════════════════════════════════════════════════════════

const seedData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlandı.");

    // ╔══════════════════════════════════════════════════════╗
    // ║  ⚠️ KULLANICILARI SİLME! Sadece mekanları temizle  ║
    // ╚══════════════════════════════════════════════════════╝
    await Place.deleteMany({});
    await Review.deleteMany({});
    console.log("🗑️ Mekan ve yorum verileri temizlendi. (Kullanıcılar KORUNDU ✅)");

    // --- 1. Demo Kullanıcılar (Upsert — Varsa DOKUNMA, Yoksa OLUŞTUR) ---
    const demoUsers = [
      { name: "Demo User", email: "demo@test.com", password: "password123" },
      { name: "Ahmet Yılmaz", email: "ahmet@test.com", password: "password123" },
    ];

    let createdCount = 0;
    let ownerUser = null;

    for (const demoUser of demoUsers) {
      const existing = await User.findOne({ email: demoUser.email });
      if (existing) {
        // Kullanıcı zaten var → dokunma, şifresini tekrar hash'leme
        ownerUser = ownerUser || existing;
        console.log(`  ✓ ${demoUser.email} zaten mevcut (atlanıyor)`);
      } else {
        // Kullanıcı yok → yeni oluştur (User.create pre-save hook ile hash'ler)
        const newUser = await User.create(demoUser);
        ownerUser = ownerUser || newUser;
        createdCount++;
        console.log(`  + ${demoUser.email} oluşturuldu`);
      }
    }

    // En az bir owner user lazım (mekan createdBy alanı için)
    if (!ownerUser) {
      ownerUser = await User.findOne();
    }
    if (!ownerUser) {
      ownerUser = await User.create(demoUsers[0]);
      createdCount++;
    }

    console.log(`👥 ${createdCount} yeni kullanıcı oluşturuldu. Mevcut kullanıcılar korundu.`);

    // --- 2. Overpass API'den Gerçek Verileri Çek ---
    console.log("🌍 OpenStreetMap Overpass API'den mekanlar çekiliyor (Tatvan/Bitlis bölgesi)...");

    let placesToInsert = [];

    try {
      const response = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "YakinKafe/1.0 (Educational Project)"
        },
        body: `data=${encodeURIComponent(OVERPASS_QUERY)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API Hatası: ${response.status}`);
      }

      const data = await response.json();
      const nodes = data.elements || [];

      console.log(`📍 API'den ${nodes.length} adet ham mekan verisi alındı.`);

      // --- 3. Verileri Mongoose Şemasına Uygun Hale Getir ---
      for (const node of nodes) {
        if (!node.tags || (!node.tags.name && !node.tags.amenity)) continue;

        const amenity = node.tags.amenity || "cafe";
        let category = "diger";
        if (amenity.includes("cafe")) category = "kahve";
        else if (amenity.includes("restaurant") || amenity.includes("fast_food")) category = "restoran";
        else if (amenity.includes("bar") || amenity.includes("pub")) category = "bar";

        const randomImage = KAFE_GORSELLERI[Math.floor(Math.random() * KAFE_GORSELLERI.length)];
        const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
        const randomReviewsCount = Math.floor(Math.random() * 300) + 10;
        const randomPriceLevel = Math.floor(Math.random() * 4) + 1;

        placesToInsert.push({
          name: node.tags.name || `${category.charAt(0).toUpperCase() + category.slice(1)} Mekanı`,
          description: `Tatvan merkezde bulunan güzel bir ${category} mekanı. OpenStreetMap verisidir.`,
          category: category,
          location: {
            type: "Point",
            coordinates: [node.lon, node.lat]
          },
          address: {
            street: node.tags["addr:street"] || "",
            district: "Tatvan",
            city: "Bitlis"
          },
          priceLevel: randomPriceLevel,
          amenities: ["wifi", "bahce"],
          averageRating: parseFloat(randomRating),
          totalReviews: randomReviewsCount,
          images: [randomImage],
          createdBy: ownerUser._id,
          isUserAdded: false,
          isActive: true,
          status: "approved"
        });
      }

      console.log(`✅ Overpass API'den ${placesToInsert.length} mekan işlendi.`);
    } catch (overpassErr) {
      console.warn(`⚠️ Overpass API başarısız: ${overpassErr.message}`);
      console.log("📦 Hazır fallback veriler kullanılıyor...");
    }

    // Fallback: API'den yeterli veri gelemediyse hazır mekanları ekle
    if (placesToInsert.length < 5) {
      console.log(`📦 ${FALLBACK_PLACES.length} adet hazır Tatvan/Bitlis mekanı ekleniyor...`);
      for (const fp of FALLBACK_PLACES) {
        placesToInsert.push({
          name: fp.name,
          description: fp.description,
          category: fp.category,
          location: { type: "Point", coordinates: fp.coords },
          address: { district: "Tatvan", city: "Bitlis" },
          priceLevel: fp.priceLevel,
          amenities: ["wifi"],
          averageRating: fp.rating,
          totalReviews: fp.reviews,
          images: [KAFE_GORSELLERI[Math.floor(Math.random() * KAFE_GORSELLERI.length)]],
          createdBy: ownerUser._id,
          isUserAdded: false,
          isActive: true,
          status: "approved"
        });
      }
    }

    const insertedPlaces = await Place.insertMany(placesToInsert);
    console.log(`✅ MongoDB'ye ${insertedPlaces.length} adet mekan kaydedildi.`);

    console.log("\n🚀 İşlem Tamam! Şimdi sunucuyu başlatabilirsiniz.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seed Hatası:", error);
    process.exit(1);
  }
};

seedData();
