import User from "../models/User.js";

/**
 * Auth Service — İş mantığı katmanı
 */
const authService = {
  /**
   * Yeni kullanıcı kaydı
   */
  async register({ name, email, password }) {
    // E-posta kontrolü
    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error("Bu e-posta adresi zaten kayıtlı");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password });
    return user;
  },

  /**
   * Kullanıcı girişi
   */
  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("E-posta veya şifre hatalı");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("E-posta veya şifre hatalı");
      error.statusCode = 401;
      throw error;
    }

    return user;
  },

  /**
   * Kullanıcı profilini getir
   */
  async getProfile(userId) {
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      const error = new Error("Kullanıcı bulunamadı");
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  /**
   * Favorilere ekle / çıkar (toggle)
   */
  async toggleFavorite(userId, placeId) {
    const user = await User.findById(userId);
    const index = user.favorites.indexOf(placeId);

    if (index === -1) {
      user.favorites.push(placeId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    return { isFavorite: index === -1, favorites: user.favorites };
  },
};

export default authService;
