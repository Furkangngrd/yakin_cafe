import placeController from "../controllers/placeController.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";

/**
 * Admin Rotaları — Sadece admin rolü erişebilir
 * Prefix: /api/admin
 */
export default async function adminRoutes(fastify) {
  // Tüm admin rotaları için auth + admin kontrolü
  fastify.addHook("preHandler", authMiddleware);
  fastify.addHook("preHandler", adminOnly);

  // Onay bekleyen mekanları listele
  fastify.get("/cafes/pending", placeController.getPending);

  // Mekanı onayla
  fastify.put("/cafes/:id/approve", placeController.approve);

  // Mekanı reddet
  fastify.put("/cafes/:id/reject", placeController.reject);
}
