const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NotificationSettings = sequelize.define("NotificationSettings", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  message_notifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  sound: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  previews: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  desktop: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "notification_settings",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = NotificationSettings;
