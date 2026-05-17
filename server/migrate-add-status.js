import "dotenv/config";
import mongoose from "mongoose";
import Place from "./src/models/Place.js";

/**
 * 🔧 Migration: Mevcut tüm mekanlara status: 'approved' ata
 *    Bu script sadece bir kez çalıştırılmalıdır.
 *    Halihazırda veritabanında bulunan ve status alanı olmayan
 *    tüm mekanlara 'approved' değeri verir.
 */

async function migrate() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bağlantısı başarılı.");

    // status alanı olmayan veya null olan tüm mekanları güncelle
    const result = await Place.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }] },
      { $set: { status: "approved" } }
    );

    console.log(`✅ ${result.modifiedCount} mekanın durumu 'approved' olarak güncellendi.`);
    console.log(`📊 Toplam eşleşen: ${result.matchedCount}`);

    const total = await Place.countDocuments();
    const approved = await Place.countDocuments({ status: "approved" });
    const pending = await Place.countDocuments({ status: "pending" });
    const rejected = await Place.countDocuments({ status: "rejected" });

    console.log(`\n📊 Durum Özeti:`);
    console.log(`   Toplam: ${total}`);
    console.log(`   ✅ Onaylı: ${approved}`);
    console.log(`   ⏳ Bekleyen: ${pending}`);
    console.log(`   ❌ Reddedilen: ${rejected}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration hatası:", err.message);
    process.exit(1);
  }
}

migrate();
