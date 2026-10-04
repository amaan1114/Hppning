import HttpError from "../utils/httpError.js";
import { errorMessages } from "../constants/messages.js";
import { logger } from "../utils/logger.js";

export default function globalHandler(
  err,
  req,
  res,
  _next,
) {
  if (err instanceof HttpError) {
    logger.error(`Handled error: ${req.method} ${req.originalUrl}`, {
      status: err.status,
      payload: err.payload,
    });

    return res.status(err.status).json({
      success: false,
      message: err.payload.message,
      data: err.payload.data,
    });
  }

  logger.error(`Unhandled error: ${req.method} ${req.originalUrl}`, {
    error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
  });

  return res.status(500).json({
    success: false,
    message: errorMessages.INTERNAL_SERVER_ERROR,
    data: null,
  });
}