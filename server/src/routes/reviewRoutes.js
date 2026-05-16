import reviewController from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/auth.js";

/**
 * Review (Yorum) Rotaları
 */
export default async function reviewRoutes(fastify) {
  // Genel rotalar
  fastify.get("/:placeId", reviewController.getByPlace);

  // Korumalı rotalar
  fastify.post("/", { preHandler: [authMiddleware] }, reviewController.create);
  fastify.delete("/:id", { preHandler: [authMiddleware] }, reviewController.remove);
}
