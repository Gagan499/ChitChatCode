const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../services/autheService");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Check username uniqueness
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user profile (Me)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Please provide username" });
    }

    // Check username uniqueness (excluding current user)
    const usernameExists = await User.findOne({
      where: { username, id: { [require("sequelize").Op.ne]: req.user.id } },
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Update user
    await User.update({ username }, { where: { id: req.user.id } });

    // Fetch updated user
    const updatedUser = await User.findByPk(req.user.id);

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("Error in updateMe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout,
  updateMe,
};
