export function httpResponse(res, req, status, message, data) {
  const response = {
    success: true,
    status,
    message,
    data,
    audit: {
      requestedBy: req.ip || "Unknown",
      timestamp: new Date().toISOString(),
      requestedUrl: req.originalUrl,
    },
  };

  return res.status(status).json({
    success: response.success,
    status: response.status,
    message: response.message,
    data: response.data,
  });
}
