import mongoose from "mongoose";
import Place from "./Place.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Yorum sahibi zorunludur"],
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: [true, "Mekan bilgisi zorunludur"],
    },
    rating: {
      type: Number,
      required: [true, "Puan zorunludur"],
      min: [1, "Puan en az 1 olabilir"],
      max: [5, "Puan en fazla 5 olabilir"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Yorum en fazla 500 karakter olabilir"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Bir kullanıcı aynı mekana tek yorum ───
reviewSchema.index({ user: 1, place: 1 }, { unique: true });
reviewSchema.index({ place: 1 });

// ─── Ortalama Puanı Güncelle (post-save) ────
reviewSchema.statics.calcAverageRating = async function (placeId) {
  const stats = await this.aggregate([
    { $match: { place: placeId } },
    {
      $group: {
        _id: "$place",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Place.findByIdAndUpdate(placeId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  } else {
    await Place.findByIdAndUpdate(placeId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.place);
});

reviewSchema.post(
  "findOneAndDelete",
  { document: true, query: false },
  function () {
    this.constructor.calcAverageRating(this.place);
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
