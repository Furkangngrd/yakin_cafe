import mongoose from "mongoose";
import env from "./env.js";

/**
 * MongoDB bağlantısını kurar.
 * Bağlantı havuzu (pool) ve yeniden deneme ayarlarıyla production-ready.
 */
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(env.mongodbUri, {
      // Connection pool ayarları
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB bağlantısı başarılı: ${conn.connection.host}`);

    // Bağlantı olaylarını dinle
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB bağlantı hatası:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB bağlantısı koptu");
    });

    return conn;
  } catch (error) {
    console.error("❌ MongoDB bağlantı hatası:", error.message);
    process.exit(1);
  }
};

export default connectDB;
