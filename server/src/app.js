import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

// Route modülleri
import authRoutes from "./routes/authRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// İzin verilen origin'ler
const ALLOWED_ORIGINS = [
  "https://5km-yakinkafe.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// ═══════════════════════════════════════════════
// Fastify Server Başlatma
// ═══════════════════════════════════════════════
const app = Fastify({
  logger: {
    level: env.isDev ? "info" : "warn",
    ...(env.isDev && {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    }),
  },
});

// ═══════════════════════════════════════════════
// 🔧 MANUEL CORS — Hazır kütüphane KULLANILMIYOR
//    Her istek ve her yanıt için header'ları BİZZAT ekliyoruz.
// ═══════════════════════════════════════════════

// 1) onRequest: Gelen her istekte CORS header'larını damgala
//    + OPTIONS (preflight) isteklerini anında 200 ile bitir
app.addHook("onRequest", async (request, reply) => {
  const origin = request.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
  }
  reply.header("Access-Control-Allow-Credentials", "true");
  reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Preflight (OPTIONS) isteğini hemen yanıtla, route'lara düşürme
  if (request.method === "OPTIONS") {
    reply.code(204).send();
    return;
  }
});

// 2) onSend: Hata yanıtlarında bile CORS header'ının eklenmesini garanti et
app.addHook("onSend", async (request, reply) => {
  const origin = request.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    reply.header("Access-Control-Allow-Origin", origin);
  }
  reply.header("Access-Control-Allow-Credentials", "true");
});
await app.register(rateLimitPlugin);
await app.register(fastifyJwt, {
  secret: env.jwtSecret,
  sign: { expiresIn: env.jwtExpiresIn },
});

// ─── Global Error Handler ────────────────────
app.setErrorHandler(globalErrorHandler);

// ─── Health Check ────────────────────────────
app.get("/api/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

// ─── Rotaları Kaydet ─────────────────────────
app.register(authRoutes, { prefix: "/api/auth" });
app.register(placeRoutes, { prefix: "/api/places" });
app.register(reviewRoutes, { prefix: "/api/reviews" });
app.register(adminRoutes, { prefix: "/api/admin" });

// ─── Sunucuyu Başlat ─────────────────────────
const start = async () => {
  try {
    // MongoDB bağlantısı
    await connectDB();

    // ─── 👑 Sabit Admin Hesabı Oluştur (yoksa) ──────
    try {
      const adminExists = await User.findOne({ email: "admin@yakinkafe.com" });
      if (!adminExists) {
        await User.create({
          name: "YakınKafe Admin",
          email: "admin@yakinkafe.com",
          password: "admin123",
          role: "admin",
        });
        console.log("👑 Admin hesabı oluşturuldu: admin@yakinkafe.com");
      }
    } catch (adminErr) {
      // Duplicate key veya başka hata → sessizce geç
      if (adminErr.code !== 11000) {
        console.warn("⚠️ Admin hesabı kontrol hatası:", adminErr.message);
      }
    }

    // Sunucu dinlemeye başla
    await app.listen({ port: env.port, host: env.host });
    console.log(`\n🚀 Sunucu çalışıyor: http://${env.host}:${env.port}`);
    console.log(`📍 Ortam: ${env.nodeEnv}\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n⏹  ${signal} alındı. Sunucu kapatılıyor...`);
  await app.close();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

start();
