const dataStore = require("../services/dataStore");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await dataStore.findUserByEmail(email);
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

    const token = generateToken(user._id, user.role);

    // passwordHash already removed by dataStore.createUser
    return successResponse(res, 201, "User registered successfully", {
      user,
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

    const user = await dataStore.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken(user._id.toString(), user.role);

    // Convert Mongoose document to plain object and remove passwordHash
    const userObject = user.toObject();
    delete userObject.passwordHash;

    return successResponse(res, 200, "Login successful", {
      user: userObject,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, "Error logging in");
  }
};

const getMe = async (req, res) => {
  try {
    const user = await dataStore.findUserById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    // Convert to plain object, passwordHash already excluded by select
    const userObject = user.toObject();

    return successResponse(
      res,
      200,
      "User retrieved successfully",
      userObject
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
