import Place from "../models/Place.js";

/**
 * Place Service — GeoSpatial sorguları dahil mekan iş mantığı
 */
const placeService = {
  /**
   * Yeni mekan oluştur
   */
  async create(data, userId) {
    const place = await Place.create({ ...data, createdBy: userId, status: "pending" });
    return place;
  },

  /**
   * Tüm mekanları getir (filtreli, sayfalı)
   */
  async getAll({ category, priceLevel, minRating, search, page = 1, limit = 20 }) {
    const filter = { isActive: true, status: "approved" };

    if (category) filter.category = category;
    if (priceLevel) filter.priceLevel = parseInt(priceLevel, 10);
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) };
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const total = await Place.countDocuments(filter);

    const places = await Place.find(filter)
      .populate("createdBy", "name avatar")
      .sort({ averageRating: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return {
      places,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Tek mekan getir (detay)
   */
  async getById(id) {
    const place = await Place.findById(id)
      .populate("createdBy", "name avatar")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name avatar" },
        options: { sort: { createdAt: -1 }, limit: 20 },
      });

    if (!place) {
      const error = new Error("Mekan bulunamadı");
      error.statusCode = 404;
      throw error;
    }

    return place;
  },

  /**
   * Mekan güncelle
   */
  async update(id, data, userId) {
    const place = await Place.findById(id);
    if (!place) {
      const error = new Error("Mekan bulunamadı");
      error.statusCode = 404;
      throw error;
    }

    if (place.createdBy.toString() !== userId) {
      const error = new Error("Bu mekanı düzenleme yetkiniz yok");
      error.statusCode = 403;
      throw error;
    }

    Object.assign(place, data);
    await place.save();
    return place;
  },

  /**
   * Mekan sil
   */
  async remove(id, userId) {
    const place = await Place.findById(id);
    if (!place) {
      const error = new Error("Mekan bulunamadı");
      error.statusCode = 404;
      throw error;
    }

    if (place.createdBy.toString() !== userId) {
      const error = new Error("Bu mekanı silme yetkiniz yok");
      error.statusCode = 403;
      throw error;
    }

    await place.deleteOne();
    return { message: "Mekan silindi" };
  },

  // ═══════════════════════════════════════════
  // 🌍 GeoSpatial Sorgular
  // ═══════════════════════════════════════════

  /**
   * $geoNear — Belirtilen noktaya X km yarıçapındaki mekanları
   *            mesafeye göre yakından uzağa sıralı getirir.
   *
   * @param {number} lng - Boylam
   * @param {number} lat - Enlem
   * @param {number} maxDistanceKm - Kilometre cinsinden yarıçap
   * @param {string} [category] - Opsiyonel kategori filtresi
   */
  async findNearby(lng, lat, maxDistanceKm = 5, category) {
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    const distanceLimit = parseFloat(maxDistanceKm || 5) * 1000;

    if (isNaN(longitude) || isNaN(latitude)) {
      throw new Error("Geçersiz koordinat formatı");
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: distanceLimit,
          spherical: true,
          query: { isActive: true, status: "approved", ...(category && { category }) },
        },
      },
      {
        $addFields: {
          distanceKm: {
            $round: [{ $divide: ["$distance", 1000] }, 2],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [{ $project: { name: 1, avatar: 1 } }],
        },
      },
      { 
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true 
        }
      },
      { $limit: 50 },
    ];

    return Place.aggregate(pipeline);
  },

  /**
   * $geoWithin — Belirtilen polygon içindeki mekanları getirir.
   *
   * @param {Array} polygonCoordinates - GeoJSON polygon koordinatları
   *        Örn: [[[lng1,lat1],[lng2,lat2],[lng3,lat3],[lng1,lat1]]]
   */
  async findWithinPolygon(polygonCoordinates, category) {
    const filter = {
      isActive: true,
      status: "approved",
      location: {
        $geoWithin: {
          $geometry: {
            type: "Polygon",
            coordinates: polygonCoordinates,
          },
        },
      },
    };

    if (category) filter.category = category;

    return Place.find(filter).populate("createdBy", "name avatar");
  },

  // ═══════════════════════════════════════════
  // 👑 Admin — Onay Sistemi
  // ═══════════════════════════════════════════

  /**
   * Onay bekleyen mekanları listele
   */
  async getPending() {
    return Place.find({ status: "pending" })
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 });
  },

  /**
   * Mekanı onayla
   */
  async approve(id) {
    const place = await Place.findById(id);
    if (!place) {
      const error = new Error("Mekan bulunamadı");
      error.statusCode = 404;
      throw error;
    }
    place.status = "approved";
    await place.save();
    return place;
  },

  /**
   * Mekanı reddet
   */
  async reject(id) {
    const place = await Place.findById(id);
    if (!place) {
      const error = new Error("Mekan bulunamadı");
      error.statusCode = 404;
      throw error;
    }
    place.status = "rejected";
    await place.save();
    return place;
  },
};

export default placeService;
