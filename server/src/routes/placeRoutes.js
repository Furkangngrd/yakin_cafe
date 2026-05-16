import placeController from "../controllers/placeController.js";
import { authMiddleware } from "../middlewares/auth.js";

/**
 * Place (Mekan) Rotaları
 */
export default async function placeRoutes(fastify) {
  // Genel rotalar (herkes erişebilir)
  fastify.get("/", placeController.getAll);
  fastify.get("/nearby", placeController.nearby);
  fastify.get("/:id", placeController.getById);

  // Korumalı rotalar
  fastify.post("/", { preHandler: [authMiddleware] }, placeController.create);
  fastify.post("/within", { preHandler: [authMiddleware] }, placeController.within);
  fastify.put("/:id", { preHandler: [authMiddleware] }, placeController.update);
  fastify.delete("/:id", { preHandler: [authMiddleware] }, placeController.remove);
}
