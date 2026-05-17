import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import Place from "./src/models/Place.js";
import Review from "./src/models/Review.js";

/**
 * 🌱 Seed Script — Örnek mekan ve kullanıcı verisi oluşturur
 * İstanbul'un popüler bölgelerinde gerçekçi koordinatlarla
 */

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlandı");

    // Mevcut verileri temizle
    await User.deleteMany({});
    await Place.deleteMany({});
    await Review.deleteMany({});
    console.log("🗑️  Mevcut veriler temizlendi");

    // ─── Kullanıcılar ────────────────────────
    const users = await User.create([
      { name: "Ahmet Yılmaz", email: "ahmet@test.com", password: "123456" },
      { name: "Elif Demir", email: "elif@test.com", password: "123456" },
      { name: "Can Öztürk", email: "can@test.com", password: "123456" },
    ]);
    console.log(`👥 ${users.length} kullanıcı oluşturuldu`);

    // ─── Mekanlar (İstanbul - Kadıköy/Beşiktaş/Beyoğlu çevresi) ───
    const places = await Place.create([
      {
        name: "Mandabatmaz",
        description: "İstanbul'un efsanevi Türk kahvesi durağı. 1967'den beri hizmet veriyor.",
        category: "kahve",
        location: { type: "Point", coordinates: [28.9744, 41.0316] },
        address: { street: "Olivia Geçidi No:1/A", district: "Beyoğlu", city: "İstanbul" },
        priceLevel: 2,
        amenities: ["wifi"],
        averageRating: 4.8,
        totalReviews: 3,
        createdBy: users[0]._id,
        status: "approved",
      },
      {
        name: "Kronotrop Coffee",
        description: "3. dalga kahve akımının İstanbul öncülerinden. Özel kavrum kahveler.",
        category: "kahve",
        location: { type: "Point", coordinates: [29.0285, 41.0082] },
        address: { street: "Caferağa Mah.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 3,
        amenities: ["wifi", "priz", "bahce"],
        averageRating: 4.5,
        totalReviews: 2,
        createdBy: users[1]._id,
        status: "approved",
      },
      {
        name: "Walter's Coffee Roastery",
        description: "Breaking Bad temalı kafe. Benzersiz konsept ve lezzetli kahveler.",
        category: "kahve",
        location: { type: "Point", coordinates: [29.0275, 41.0088] },
        address: { street: "Moda Cad.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 3,
        amenities: ["wifi", "priz"],
        averageRating: 4.3,
        totalReviews: 1,
        createdBy: users[2]._id,
        status: "approved",
      },
      {
        name: "Baylan Pastanesi",
        description: "1923'ten beri Kadıköy'ün vazgeçilmez tatlıcısı. Kup griye ile meşhur.",
        category: "tatli",
        location: { type: "Point", coordinates: [29.0258, 41.0073] },
        address: { street: "Muvakkithane Cad.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 2,
        amenities: [],
        averageRating: 4.6,
        totalReviews: 2,
        createdBy: users[0]._id,
        status: "approved",
      },
      {
        name: "MOC Kadıköy",
        description: "Ministry of Coffee — Geniş çalışma alanı ve premium kahve deneyimi.",
        category: "calisma-alani",
        location: { type: "Point", coordinates: [29.0298, 41.0095] },
        address: { street: "Bahariye Cad.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 3,
        amenities: ["wifi", "priz", "calisma-alani"],
        averageRating: 4.4,
        totalReviews: 1,
        createdBy: users[1]._id,
        status: "approved",
      },
      {
        name: "Çiya Sofrası",
        description: "Anadolu mutfağının en otantik lezzetlerini sunan efsane restoran.",
        category: "restoran",
        location: { type: "Point", coordinates: [29.0231, 41.0059] },
        address: { street: "Güneşlibahçe Sok.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 2,
        amenities: ["bahce"],
        averageRating: 4.7,
        totalReviews: 3,
        createdBy: users[2]._id,
        status: "approved",
      },
      {
        name: "House Café Ortaköy",
        description: "Boğaz manzarasında brunch ve kahve keyfi.",
        category: "brunch",
        location: { type: "Point", coordinates: [29.0262, 41.0479] },
        address: { street: "Salhane Sok.", district: "Beşiktaş", city: "İstanbul" },
        priceLevel: 4,
        amenities: ["wifi", "bahce", "manzara"],
        averageRating: 4.1,
        totalReviews: 2,
        createdBy: users[0]._id,
        status: "approved",
      },
      {
        name: "Karabatak",
        description: "Gizli geçitten girilen, sanatçıların buluşma noktası. Harika kahve.",
        category: "kahve",
        location: { type: "Point", coordinates: [28.9763, 41.0291] },
        address: { street: "Kartal Sok.", district: "Beyoğlu", city: "İstanbul" },
        priceLevel: 2,
        amenities: ["wifi", "priz", "hayvan-dostu"],
        averageRating: 4.5,
        totalReviews: 2,
        createdBy: users[1]._id,
        status: "approved",
      },
      {
        name: "Fazıl Bey",
        description: "Kadıköy'ün en eski Türk kahvecisi. Geleneksel lezzetler.",
        category: "kahve",
        location: { type: "Point", coordinates: [29.0242, 41.0068] },
        address: { street: "Serasker Cad.", district: "Kadıköy", city: "İstanbul" },
        priceLevel: 1,
        amenities: [],
        averageRating: 4.4,
        totalReviews: 2,
        createdBy: users[2]._id,
        status: "approved",
      },
      {
        name: "Petra Roasting Co.",
        description: "Specialty coffee ve minimal tasarım. Kendi kavurdukları çekirdekler.",
        category: "kahve",
        location: { type: "Point", coordinates: [28.9869, 41.0432] },
        address: { street: "Akarsu Cad.", district: "Beşiktaş", city: "İstanbul" },
        priceLevel: 3,
        amenities: ["wifi", "priz"],
        averageRating: 4.6,
        totalReviews: 1,
        createdBy: users[0]._id,
        status: "approved",
      },
    ]);
    console.log(`📍 ${places.length} mekan oluşturuldu`);

    // ─── Yorumlar ────────────────────────────
    const reviews = await Review.create([
      { user: users[0]._id, place: places[0]._id, rating: 5, comment: "Muhteşem Türk kahvesi! Her geldiğimde başka bir tat alıyorum." },
      { user: users[1]._id, place: places[0]._id, rating: 5, comment: "İstanbul'un en iyi kahvecisi, tartışmasız." },
      { user: users[2]._id, place: places[0]._id, rating: 4, comment: "Atmosfer harika ama yer bulmak zor." },
      { user: users[0]._id, place: places[1]._id, rating: 4, comment: "Filtre kahveleri çok iyi. V60 tavsiyemdir." },
      { user: users[1]._id, place: places[1]._id, rating: 5, comment: "3. dalga kahvenin en iyi adresi." },
      { user: users[2]._id, place: places[2]._id, rating: 4, comment: "Konsepti çok eğlenceli, kahveler de güzel." },
      { user: users[0]._id, place: places[3]._id, rating: 5, comment: "Kup griye efsane! Mutlaka deneyin." },
      { user: users[1]._id, place: places[3]._id, rating: 4, comment: "Nostaljik bir mekan, tatlıları harika." },
      { user: users[0]._id, place: places[5]._id, rating: 5, comment: "Anadolu lezzetlerini böyle özgün sunan başka yer yok." },
      { user: users[1]._id, place: places[5]._id, rating: 5, comment: "Her tabak bir hikaye anlatıyor. Mükemmel!" },
      { user: users[2]._id, place: places[5]._id, rating: 4, comment: "Sıra beklemeye değer!" },
    ]);
    console.log(`💬 ${reviews.length} yorum oluşturuldu`);

    console.log("\n✅ Seed işlemi tamamlandı!\n");
    console.log("Test kullanıcıları:");
    console.log("  📧 ahmet@test.com  / 🔑 123456");
    console.log("  📧 elif@test.com   / 🔑 123456");
    console.log("  📧 can@test.com    / 🔑 123456\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed hatası:", error);
    process.exit(1);
  }
};

seedData();
