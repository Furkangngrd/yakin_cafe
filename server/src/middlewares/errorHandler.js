/**
 * Global Error Handler
 * Mongoose validation, duplicate key ve genel hatalar yakalanır.
 */
const globalErrorHandler = (error, request, reply) => {
  request.log.error(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Sunucu hatası";

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(error.errors).map((e) => e.message);
    message = messages.join(", ");
  }

  // MongoDB Duplicate Key Error
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue)[0];
    message = `Bu ${field} zaten kullanımda`;
  }

  // JWT Error
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Geçersiz token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token süresi doldu. Lütfen tekrar giriş yapınız.";
  }

  // Mongoose CastError (geçersiz ObjectId)
  if (error.name === "CastError") {
    statusCode = 400;
    message = `Geçersiz ${error.path}: ${error.value}`;
  }

  reply.code(statusCode).send({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default globalErrorHandler;
