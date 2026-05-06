const { Op } = require("sequelize");
const User = require("../models/User");
const NotificationSettings = require("../models/NotificationSettings");
const UserSession = require("../models/UserSession");

// ─── Helper: parse device info from user-agent ────────────────────────────
function parseDeviceName(userAgent = "") {
  if (!userAgent) return "Unknown Device";
  if (/mobile/i.test(userAgent)) return "Mobile Browser";
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/macintosh|mac os/i.test(userAgent)) return "Mac";
  if (/linux/i.test(userAgent)) return "Linux PC";
  return "Browser";
}

// ─── Helper: get or create notification settings ──────────────────────────
async function getOrCreateNotifSettings(userId) {
  const [settings] = await NotificationSettings.findOrCreate({
    where: { user_id: userId },
    defaults: {
      user_id: userId,
      message_notifications: true,
      sound: true,
      previews: true,
      desktop: false,
    },
  });
  return settings;
}

// ─── Helper: safe user response object ───────────────────────────────────
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

// ─── GET /api/users ───────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: ["id", "username", "email"],
      order: [["username", "ASC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── PUT /api/users/update-profile ───────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const username = req.body.username || req.body.name;
    const { about } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Display name is required" });
    }

    const taken = await User.findOne({
      where: { username: username.trim(), id: { [Op.ne]: req.user.id } },
    });
    if (taken) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const payload = { username: username.trim() };
    if (about !== undefined) payload.about = about;

    await User.update(payload, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(safeUser(updatedUser));
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── PUT /api/users/language ──────────────────────────────────────────────
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const SUPPORTED = ["en", "es", "fr", "de", "hi", "zh", "ar", "pt", "ja"];
    if (!language || !SUPPORTED.includes(language)) {
      return res.status(400).json({ message: "Unsupported language code" });
    }
    await User.update({ language }, { where: { id: req.user.id } });
    res.json({ language });
  } catch (error) {
    console.error("Error in updateLanguage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── PUT /api/users/toggle-2fa ────────────────────────────────────────────
const toggle2FA = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const newValue = !user.two_factor_enabled;
    await User.update({ two_factor_enabled: newValue }, { where: { id: req.user.id } });
    res.json({ two_factor_enabled: newValue });
  } catch (error) {
    console.error("Error in toggle2FA:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET /api/users/notifications ────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const settings = await getOrCreateNotifSettings(req.user.id);
    res.json({
      message_notifications: settings.message_notifications,
      sound: settings.sound,
      previews: settings.previews,
      desktop: settings.desktop,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── PUT /api/users/notifications ────────────────────────────────────────
const updateNotifications = async (req, res) => {
  try {
    const { message_notifications, sound, previews, desktop } = req.body;
    const settings = await getOrCreateNotifSettings(req.user.id);

    const payload = {};
    if (message_notifications !== undefined) payload.message_notifications = Boolean(message_notifications);
    if (sound !== undefined) payload.sound = Boolean(sound);
    if (previews !== undefined) payload.previews = Boolean(previews);
    if (desktop !== undefined) payload.desktop = Boolean(desktop);

    await settings.update(payload);

    res.json({
      message_notifications: settings.message_notifications,
      sound: settings.sound,
      previews: settings.previews,
      desktop: settings.desktop,
    });
  } catch (error) {
    console.error("Error in updateNotifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET /api/users/devices ───────────────────────────────────────────────
const getDevices = async (req, res) => {
  try {
    const sessions = await UserSession.findAll({
      where: { user_id: req.user.id },
      order: [["last_active", "DESC"]],
    });
    res.json(sessions);
  } catch (error) {
    console.error("Error in getDevices:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── DELETE /api/users/devices/:id ───────────────────────────────────────
const deleteDevice = async (req, res) => {
  try {
    const session = await UserSession.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    await session.destroy();
    res.json({ message: "Session removed" });
  } catch (error) {
    console.error("Error in deleteDevice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  updateProfile,
  updateLanguage,
  toggle2FA,
  getNotifications,
  updateNotifications,
  getDevices,
  deleteDevice,
};
