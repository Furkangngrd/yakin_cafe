import authService from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const authController = {
  /**
   * POST /api/auth/register
   */
  async register(request, reply) {
    try {
      const { name, email, password } = request.body;
      console.log("📝 Register isteği alındı. Body:", { name, email });

      if (!name || !email || !password) {
        console.warn("⚠️ Register başarısız: Tüm alanlar zorunlu");
        return sendError(reply, "Tüm alanlar zorunludur", 400);
      }

      const user = await authService.register({ name, email, password });
      const token = request.server.jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      console.log("✅ Register başarılı:", user.email);
      return sendSuccess(
        reply,
        { user, token },
        201
      );
    } catch (error) {
      console.error("Auth Detaylı Hata:", error.message);
      console.error("❌ Register hatası detayları:", error);
      throw error;
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(request, reply) {
    try {
      const { email, password } = request.body;
      console.log("🔑 Login isteği alındı. Email:", email);

      if (!email || !password) {
        console.warn("⚠️ Login başarısız: E-posta ve şifre zorunlu");
        return sendError(reply, "E-posta ve şifre zorunludur", 400);
      }

      const user = await authService.login({ email, password });
      const token = request.server.jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      console.log("✅ Login başarılı:", user.email);
      return sendSuccess(reply, { user, token });
    } catch (error) {
      console.error("Auth Detaylı Hata:", error.message);
      console.error("❌ Login hatası detayları:", error);
      throw error;
    }
  },

  /**
   * GET /api/auth/me
   */
  async me(request, reply) {
    const user = await authService.getProfile(request.user.id);
    return sendSuccess(reply, { user });
  },

  /**
   * POST /api/auth/favorites/:placeId
   */
  async toggleFavorite(request, reply) {
    const result = await authService.toggleFavorite(
      request.user.id,
      request.params.placeId
    );
    return sendSuccess(reply, result);
  },
};

export default authController;
