/**
 * Standart API Yanıt Yardımcıları
 */
export const sendSuccess = (reply, data, statusCode = 200) => {
  return reply.code(statusCode).send({
    success: true,
    data,
  });
};

export const sendError = (reply, message, statusCode = 400) => {
  return reply.code(statusCode).send({
    success: false,
    error: message,
  });
};

export const sendPaginated = (reply, data, pagination) => {
  return reply.code(200).send({
    success: true,
    data,
    pagination,
  });
};
