const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSession = sequelize.define("UserSession", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  device_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "Unknown Device",
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: "user_sessions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = UserSession;
