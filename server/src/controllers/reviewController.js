import reviewService from "../services/reviewService.js";
import { sendSuccess, sendPaginated } from "../utils/response.js";

const reviewController = {
  /**
   * POST /api/reviews
   */
  async create(request, reply) {
    const { placeId, rating, comment } = request.body;
    const review = await reviewService.create({
      userId: request.user.id,
      placeId,
      rating,
      comment,
    });
    return sendSuccess(reply, { review }, 201);
  },

  /**
   * GET /api/reviews/:placeId
   */
  async getByPlace(request, reply) {
    const { reviews, pagination } = await reviewService.getByPlace(
      request.params.placeId,
      request.query.page,
      request.query.limit
    );
    return sendPaginated(reply, reviews, pagination);
  },

  /**
   * DELETE /api/reviews/:id
   */
  async remove(request, reply) {
    const result = await reviewService.remove(request.params.id, request.user.id);
    return sendSuccess(reply, result);
  },
};

export default reviewController;
