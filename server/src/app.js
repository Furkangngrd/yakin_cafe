import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import cors from "@fastify/cors";
import rateLimitPlugin from "./plugins/rateLimit.js";
import globalErrorHandler from "./middlewares/errorHandler.js";

// Route modülleri
import authRoutes from "./routes/authRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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

// ─── Plugin'ler ──────────────────────────────
// ─── CORS Ayarları (En Üstte) ────────────────
await app.register(cors, {
  origin: "https://5km-yakinkafe.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Tarayıcının gönderdiği ön denetim (preflight) istekleri için
app.options("*", (request, reply) => {
  reply.send();
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

// ─── Sunucuyu Başlat ─────────────────────────
const start = async () => {
  try {
    // MongoDB bağlantısı
    await connectDB();

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
