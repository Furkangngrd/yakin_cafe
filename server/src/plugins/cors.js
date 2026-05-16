import cors from "@fastify/cors";

/**
 * CORS plugin yapılandırması
 */
export default async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://5km-yakinkafe.vercel.app",
      "*"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
