const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const RoomMember = require("../models/RoomMember");

// @desc    Get or create a 1:1 chat room between the authenticated user and another user
// @route   GET /api/rooms/direct/:otherUserId
// @access  Private
const getDirectRoom = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ message: "Missing otherUserId" });
    }

    if (otherUserId === currentUserId) {
      return res.status(400).json({ message: "Cannot create a chat with yourself" });
    }

    const otherUser = await User.findByPk(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deterministic room name for the pair
    const sortedIds = [currentUserId, otherUserId].sort();
    const roomName = `dm:${sortedIds[0]}:${sortedIds[1]}`;

    const [room] = await ChatRoom.findOrCreate({
      where: { name: roomName },
      defaults: { created_by: currentUserId },
    });

    // Ensure both users are members (for future features)
    await RoomMember.findOrCreate({ where: { room_id: room.id, user_id: currentUserId } });
    await RoomMember.findOrCreate({ where: { room_id: room.id, user_id: otherUserId } });

    res.json({ roomId: room.id });
  } catch (error) {
    console.error("Error in getDirectRoom:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDirectRoom,
};
