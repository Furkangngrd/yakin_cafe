import "dotenv/config";

const env = {
  port: parseInt(process.env.PORT || "3001", 10),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nearby-cafes",
  jwtSecret:
    process.env.JWT_SECRET || "super-secret-change-in-production-min-32-chars!!",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "60000", 10),
  isDev: (process.env.NODE_ENV || "development") === "development",
};

export default env;
