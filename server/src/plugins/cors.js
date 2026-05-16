import cors from "@fastify/cors";

/**
 * CORS plugin yapılandırması
 */
export default async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: "https://5km-yakinkafe.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Tarayıcının gönderdiği ön denetim (preflight) istekleri için
  fastify.options("*", (request, reply) => {
    reply.send();
  });
}
