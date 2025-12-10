const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  if (err.code === 11000) {
    return errorResponse(res, 400, "Duplicate field value entered");
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, "Validation Error", errors);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired");
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    err.message || "Internal Server Error"
  );
};

const notFound = (req, res) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};

module.exports = {
  errorHandler,
  notFound,
};
