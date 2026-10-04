import { randomUUID } from "node:crypto";

class HttpError extends Error {
  constructor(req, status, message, data = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.payload = {
      success: false,
      status,
      message,
      data,
      audit: {
        requestedBy: req?.ip ?? "unknown",
        timestamp: new Date().toISOString(),
        requestedUrl: req?.originalUrl ?? "unknown",
        traceId: randomUUID(),
        tracePath: req ? `${req.method} ${req.path}` : "unknown",
      },
    };
  }
}

export function sendHttpError(next, req, status, message, data = null) {
  return next(new HttpError(req, status, message, data));
}

export default HttpError;
