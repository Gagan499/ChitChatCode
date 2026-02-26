const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RoomMember = sequelize.define("RoomMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  room_id: DataTypes.UUID,
}, {
  tableName: "room_members",
  timestamps: true,
  createdAt: "joined_at",
  updatedAt: false
});

module.exports = RoomMember;