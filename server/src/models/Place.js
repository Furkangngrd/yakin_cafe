import mongoose from "mongoose";

/**
 * Place (Mekan) Şeması
 * ─────────────────────
 * GeoJSON "Point" formatında konum verisi ve "2dsphere" indeksi ile
 * MongoDB GeoSpatial sorguları desteklenir.
 */
const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mekan adı zorunludur"],
      trim: true,
      maxlength: [100, "Mekan adı en fazla 100 karakter olabilir"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Açıklama en fazla 1000 karakter olabilir"],
      default: "",
    },
    category: {
      type: String,
      required: [true, "Kategori zorunludur"],
      enum: {
        values: [
          "kahve",
          "tatli",
          "calisma-alani",
          "restoran",
          "bar",
          "pastane",
          "brunch",
          "diger",
        ],
        message: "Geçersiz kategori: {VALUE}",
      },
    },
    // ─── GeoJSON Point ──────────────────────────
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Koordinatlar zorunludur"],
        validate: {
          validator: function (val) {
            return (
              val.length === 2 &&
              val[0] >= -180 &&
              val[0] <= 180 &&
              val[1] >= -90 &&
              val[1] <= 90
            );
          },
          message: "Geçersiz koordinat değerleri",
        },
      },
    },
    address: {
      street: { type: String, trim: true, default: "" },
      district: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "İstanbul" },
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    priceLevel: {
      type: Number,
      min: 1,
      max: 4,
      default: 2, // 1=Ucuz, 2=Orta, 3=Pahalı, 4=Lüks
    },
    amenities: {
      type: [String],
      default: [],
      // Örn: ["wifi", "priz", "bahce", "otopark", "hayvan-dostu"]
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    // ─── İstatistikler (denormalize) ────────────
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // ─── Sahiplik ───────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isUserAdded: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ══════════════════════════════════════════════
// 🌍 2dsphere İndeks — GeoSpatial Sorguları İçin
// ══════════════════════════════════════════════
placeSchema.index({ location: "2dsphere" });

// ─── Ek İndeksler ───────────────────────────
placeSchema.index({ category: 1 });
placeSchema.index({ averageRating: -1 });
placeSchema.index({ priceLevel: 1 });
placeSchema.index({ createdBy: 1 });
placeSchema.index({ name: "text", description: "text" }); // Metin araması

// ─── Virtual: Reviews ──────────────────────
placeSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "place",
  justOne: false,
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
