import Review from "../models/Review.js";

/**
 * Review Service — Yorum ve puanlama iş mantığı
 */
const reviewService = {
  /**
   * Yeni yorum ekle
   */
  async create({ userId, placeId, rating, comment }) {
    // Aynı mekana tekrar yorum kontrolü (index de engeller)
    const existing = await Review.findOne({ user: userId, place: placeId });
    if (existing) {
      const error = new Error("Bu mekana zaten yorum yaptınız");
      error.statusCode = 409;
      throw error;
    }

    const review = await Review.create({
      user: userId,
      place: placeId,
      rating,
      comment,
    });

    return review.populate("user", "name avatar");
  },

  /**
   * Mekanın yorumlarını getir
   */
  async getByPlace(placeId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ place: placeId });

    const reviews = await Review.find({ place: placeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return {
      reviews,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Yorum sil
   */
  async remove(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      const error = new Error("Yorum bulunamadı");
      error.statusCode = 404;
      throw error;
    }

    if (review.user.toString() !== userId) {
      const error = new Error("Bu yorumu silme yetkiniz yok");
      error.statusCode = 403;
      throw error;
    }

    await review.deleteOne();
    return { message: "Yorum silindi" };
  },
};

export default reviewService;
