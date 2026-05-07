const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const { generateToken } = require("../services/autheService");

// ─── Helper: parse device name from user-agent ────────────────────────────
function parseDeviceName(userAgent = "") {
  if (!userAgent) return "Unknown Device";
  if (/mobile/i.test(userAgent)) return "Mobile Browser";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux PC";
  return "Browser";
}

// ─── Helper: safe public user object ─────────────────────────────────────
function safeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    about: user.about,
    language: user.language,
    two_factor_enabled: user.two_factor_enabled,
  };
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: safeUser(user),
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

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // ── Record device session ─────────────────────────────────────────
      const userAgent = req.headers["user-agent"] || "";
      const ipAddress =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "Unknown";

      // Mark all existing sessions for this user as not current
      await UserSession.update(
        { is_current: false },
        { where: { user_id: user.id } }
      );

      // Create new session
      await UserSession.create({
        user_id: user.id,
        device_name: parseDeviceName(userAgent),
        ip_address: ipAddress,
        user_agent: userAgent,
        last_active: new Date(),
        is_current: true,
      });

      res.json({
        success: true,
        user: safeUser(user),
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

    return res.json(safeUser(user));
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Update user profile (username + about)
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const username = req.body.username || req.body.name;
    const { about } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a display name" });
    }

    const usernameExists = await User.findOne({
      where: { username, id: { [require("sequelize").Op.ne]: req.user.id } },
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const updatePayload = { username };
    if (about !== undefined) updatePayload.about = about;

    await User.update(updatePayload, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(safeUser(updatedUser));
  } catch (error) {
    console.error("Error in updateMe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Google Authentication
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing Google user data" });
    }

    // Find or create user by email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Auto-register new Google users
      user = await User.create({
        username: displayName?.replace(/\s+/g, "_").toLowerCase() 
                  || email.split("@")[0],
        email,
        // Google users don't need a password — set a random hash
        password_hash: await require("bcryptjs").hash(uid + Date.now(), 10),
      });
    }

    res.json({
      success: true,
      user: safeUser(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in googleAuth:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout,
  updateMe,
  googleAuth,
};
