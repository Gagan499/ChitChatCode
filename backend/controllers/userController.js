const { Op } = require("sequelize");
const User = require("../models/User");

// @desc    Get all users (excluding the requesting user)
// @route   GET /api/users
// @access  Private
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

module.exports = {
  getUsers,
};
