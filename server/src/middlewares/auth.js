import { sendError } from "../utils/response.js";

/**
 * JWT tabanlı kimlik doğrulama middleware'i.
 * Fastify dekoratör olarak kullanılır.
 */
const authMiddleware = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return sendError(reply, "Yetkisiz erişim. Lütfen giriş yapınız.", 401);
  }
};

/**
 * Admin rol kontrolü (auth middleware'den sonra çağrılmalı)
 */
const adminOnly = async (request, reply) => {
  if (request.user.role !== "admin") {
    return sendError(reply, "Bu işlem için yetkiniz yok.", 403);
  }
};

export { authMiddleware, adminOnly };
