const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CodeSnippet = sequelize.define("CodeSnippet", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  language: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "code_snippets",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = CodeSnippet;