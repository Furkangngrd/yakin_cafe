import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
      minlength: [2, "İsim en az 2 karakter olmalıdır"],
      maxlength: [50, "İsim en fazla 50 karakter olabilir"],
    },
    email: {
      type: String,
      required: [true, "E-posta zorunludur"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w.-]+@[\w.-]+\.\w{2,}$/,
        "Geçerli bir e-posta adresi giriniz",
      ],
    },
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: [6, "Şifre en az 6 karakter olmalıdır"],
      select: false, // Varsayılan sorgularda şifre dönmez
    },
    avatar: {
      type: String,
      default: "",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── İndeksler ──────────────────────────────
userSchema.index({ email: 1 });

// ─── Şifre Hash Middleware ──────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Şifre Karşılaştırma Metodu ─────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── JSON Dönüşümünde Şifreyi Kaldır ───────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
