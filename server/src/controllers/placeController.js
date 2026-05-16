import placeService from "../services/placeService.js";
import { sendSuccess, sendPaginated, sendError } from "../utils/response.js";

const placeController = {
  /**
   * POST /api/places
   */
  async create(request, reply) {
    const { name, category, lat, lng, priceLevel, averageRating, description } = request.body;
    
    // GeoJSON Point formatına dönüştür
    const placeData = {
      name,
      category,
      description,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)] // [lng, lat]
      },
      priceLevel: parseInt(priceLevel, 10) || 2,
      averageRating: parseFloat(averageRating) || 0,
      totalReviews: averageRating ? 1 : 0, // İlk puanı değerlendirme olarak say
      isActive: true
    };

    const place = await placeService.create(placeData, request.user.id);
    return sendSuccess(reply, { place }, 201);
  },

  /**
   * GET /api/places
   */
  async getAll(request, reply) {
    const { places, pagination } = await placeService.getAll(request.query);
    return sendPaginated(reply, places, pagination);
  },

  /**
   * GET /api/places/:id
   */
  async getById(request, reply) {
    const place = await placeService.getById(request.params.id);
    return sendSuccess(reply, { place });
  },

  /**
   * PUT /api/places/:id
   */
  async update(request, reply) {
    const place = await placeService.update(
      request.params.id,
      request.body,
      request.user.id
    );
    return sendSuccess(reply, { place });
  },

  /**
   * DELETE /api/places/:id
   */
  async remove(request, reply) {
    const result = await placeService.remove(request.params.id, request.user.id);
    return sendSuccess(reply, result);
  },

  // ═══════════════════════════════════════════
  // 🌍 GeoSpatial Endpoints
  // ═══════════════════════════════════════════

  /**
   * GET /api/places/nearby?lng=X&lat=Y&maxDistance=5&category=kahve
   */
  async nearby(request, reply) {
    const { lng, lat, maxDistance, category } = request.query;

    if (!lng || !lat) {
      return sendError(reply, "lng ve lat parametreleri zorunludur", 400);
    }

    const places = await placeService.findNearby(lng, lat, maxDistance, category);
    return sendSuccess(reply, { places, count: places.length });
  },

  /**
   * POST /api/places/within
   * Body: { polygon: [[[lng1,lat1],[lng2,lat2],…]], category?: "kahve" }
   */
  async within(request, reply) {
    const { polygon, category } = request.body;

    if (!polygon || !Array.isArray(polygon)) {
      return sendError(reply, "polygon parametresi zorunludur", 400);
    }

    const places = await placeService.findWithinPolygon(polygon, category);
    return sendSuccess(reply, { places, count: places.length });
  },
};

export default placeController;
