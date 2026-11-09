import HttpError from "../utils/httpError.js";
import { errorMessages } from "../constants/messages.js";

export default function globalHandler(err, req, res, _next) {
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