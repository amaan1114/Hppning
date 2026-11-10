import HttpError from "../utils/httpError.js";
import { errorMessages } from "../constants/messages.js";

export default function globalHandler(err, req, res, _next) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;

  console.error("API Error", {
    name: err.name || "Error",
    message: err.message || "Unknown error",
    statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    });
  }

  return res.status(500).json({
    success: false,
    message: errorMessages.INTERNAL_SERVER_ERROR,
    data: null,
  });
}