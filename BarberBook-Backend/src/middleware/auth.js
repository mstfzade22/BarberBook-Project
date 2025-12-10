const { verifyToken } = require("../utils/jwt");
const dataStore = require("../services/dataStore");
const { errorResponse } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "No token provided. Please login.");
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(
        res,
        401,
        "Invalid or expired token. Please login again."
      );
    }

    const user = dataStore.findUserById(decoded.userId);

    if (!user) {
      return errorResponse(res, 401, "User not found.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      barberId: user.barberId || null,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, 500, "Server error during authentication.");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, "Not authenticated.");
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Required role: ${roles.join(" or ")}`
      );
    }

    next();
  };
};

const isCustomer = authorize("customer");

const isBarber = authorize("barber");

const isCustomerOrBarber = authorize("customer", "barber");

module.exports = {
  authenticate,
  authorize,
  isCustomer,
  isBarber,
  isCustomerOrBarber,
};
