import authService from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";

const authController = {
  /**
   * POST /api/auth/register
   */
  async register(request, reply) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return sendError(reply, "Tüm alanlar zorunludur", 400);
    }

    const user = await authService.register({ name, email, password });
    const token = request.server.jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(
      reply,
      { user, token },
      201
    );
  },

  /**
   * POST /api/auth/login
   */
  async login(request, reply) {
    const { email, password } = request.body;

    if (!email || !password) {
      return sendError(reply, "E-posta ve şifre zorunludur", 400);
    }

    const user = await authService.login({ email, password });
    const token = request.server.jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(reply, { user, token });
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
