const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your_super_secret_jwt_key",
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || "your_super_secret_jwt_key"
    );
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
