const dataStore = require("../services/dataStore");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = dataStore.findUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, "User with this email already exists");
    }

    const passwordHash = await hashPassword(password);

    const userData = {
      name,
      email,
      passwordHash,
      phone,
      role: role || "customer",
    };

    const user = await dataStore.createUser(userData);

    const token = generateToken(user.id, user.role);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return successResponse(res, 201, "User registered successfully", {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(res, 500, "Error registering user");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = dataStore.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken(user.id, user.role);

    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse(res, 200, "Login successful", {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, "Error logging in");
  }
};

const getMe = async (req, res) => {
  try {
    const user = dataStore.findUserById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return successResponse(
      res,
      200,
      "User retrieved successfully",
      userWithoutPassword
    );
  } catch (error) {
    console.error("GetMe error:", error);
    return errorResponse(res, 500, "Error retrieving user");
  }
};

module.exports = {
  register,
  login,
  getMe,
};
