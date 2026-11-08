export const httpResponse = (success, res, req, statusCode, message, data) => {
  const response = {
    success,
    message,
    trace: {
      method: req.method,
      reqUrl: req.url,
    },
    statusCode,
    data,
  };

  console.log("HttpResponse :", response);

  res.status(statusCode).json({
    message,
    data,
  });
};