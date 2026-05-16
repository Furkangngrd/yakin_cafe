import rateLimit from "@fastify/rate-limit";
import env from "../config/env.js";

/**
 * Rate Limiting plugin — OWASP standartlarına uygun istek sınırlandırma
 */
export default async function rateLimitPlugin(fastify) {
  await fastify.register(rateLimit, {
    max: env.rateLimitMax,
    timeWindow: env.rateLimitWindow,
    errorResponseBuilder: () => ({
      success: false,
      error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyiniz.",
    }),
  });
}
