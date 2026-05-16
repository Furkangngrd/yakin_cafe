import authController from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

/**
 * Auth Rotaları
 */
export default async function authRoutes(fastify) {
  // Genel rotalar
  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);

  // Korumalı rotalar
  fastify.get("/me", { preHandler: [authMiddleware] }, authController.me);
  fastify.post(
    "/favorites/:placeId",
    { preHandler: [authMiddleware] },
    authController.toggleFavorite
  );
}
