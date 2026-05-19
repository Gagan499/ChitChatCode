"use strict";

const crypto    = require("crypto");
const bcrypt    = require("bcryptjs");
const { Op }   = require("sequelize");

const User        = require("../models/User");
const UserSession = require("../models/UserSession");
const { generateToken } = require("../services/autheService");
const {
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} = require("../services/mailService");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDeviceName(userAgent = "") {
  if (!userAgent)              return "Unknown Device";
  if (/mobile/i.test(userAgent))         return "Mobile Browser";
  if (/tablet|ipad/i.test(userAgent))    return "Tablet";
  if (/windows/i.test(userAgent))        return "Windows PC";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent))          return "Linux PC";
  return "Browser";
}

function safeUser(user) {
  return {
    id:                 user.id,
    username:           user.username,
    email:              user.email,
    about:              user.about,
    language:           user.language,
    two_factor_enabled: user.two_factor_enabled,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────
// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    if (await User.findOne({ where: { username } })) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const salt         = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password_hash: hashedPassword });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    // Fire-and-forget welcome email — never block the response
    sendWelcomeEmail({ to: user.email, username: user.username });

    return res.status(201).json({
      success: true,
      user:    safeUser(user),
      token:   generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "Unknown";
    const deviceName = parseDeviceName(userAgent);

    // Check if this device/IP combo is new (fire login alert only for new devices)
    const existingSession = await UserSession.findOne({
      where: { user_id: user.id, device_name: deviceName, ip_address: ipAddress },
    });

    // Mark all previous sessions as not current
    await UserSession.update({ is_current: false }, { where: { user_id: user.id } });

    await UserSession.create({
      user_id:     user.id,
      device_name: deviceName,
      ip_address:  ipAddress,
      user_agent:  userAgent,
      last_active: new Date(),
      is_current:  true,
    });

    // Send login alert only for new device/IP combos
    if (!existingSession) {
      sendLoginAlertEmail({
        to:         user.email,
        username:   user.username,
        deviceName,
        ipAddress,
        userAgent,
      });
    }

    return res.json({
      success: true,
      user:    safeUser(user),
      token:   generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
// @route  POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    // Generic response prevents user enumeration
    const GENERIC = "If an account with that email exists, a reset link has been sent.";

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Still return 200 to not reveal whether email exists
      return res.status(200).json({ message: GENERIC });
    }

    // Generate raw token (sent in URL) and hashed token (stored in DB)
    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expire      = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      reset_password_token:  hashedToken,
      reset_password_expire: expire,
    });

    // Send email with the RAW token (never the hash)
    sendPasswordResetEmail({ to: user.email, username: user.username, token: rawToken });

    return res.status(200).json({ message: GENERIC });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
// @route  POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the incoming raw token to match what's stored
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        reset_password_token:  hashedToken,
        reset_password_expire: { [Op.gt]: new Date() }, // not expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const salt        = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.update({
      password_hash:         hashedPassword,
      reset_password_token:  null,
      reset_password_expire: null,
    });

    // Confirm via email — fire-and-forget
    sendPasswordChangedEmail({ to: user.email, username: user.username });

    return res.status(200).json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── Me / Logout / UpdateMe / Google (unchanged logic) ───────────────────────

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash", "reset_password_token", "reset_password_expire"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(safeUser(user));
  } catch (error) {
    console.error("Error in getMe:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = (_req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

const updateMe = async (req, res) => {
  try {
    const username = req.body.username || req.body.name;
    const { about } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a display name" });
    }

    const taken = await User.findOne({
      where: { username, id: { [Op.ne]: req.user.id } },
    });
    if (taken) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const payload = { username };
    if (about !== undefined) payload.about = about;
    await User.update(payload, { where: { id: req.user.id } });

    const updated = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash", "reset_password_token", "reset_password_expire"] },
    });
    return res.json(safeUser(updated));
  } catch (error) {
    console.error("Error in updateMe:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing Google user data" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        username:      displayName?.replace(/\s+/g, "_").toLowerCase() || email.split("@")[0],
        email,
        password_hash: await bcrypt.hash(uid + Date.now(), 10),
      });
      // Welcome email for new Google users
      sendWelcomeEmail({ to: user.email, username: user.username });
    }

    return res.json({
      success: true,
      user:    safeUser(user),
      token:   generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in googleAuth:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout,
  updateMe,
  googleAuth,
  forgotPassword,
  resetPassword,
};
