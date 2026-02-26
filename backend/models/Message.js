const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "chat_rooms",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    message_type: {
        type: DataTypes.STRING(20),
        defaultValue: "text",
    },
}, {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

module.exports = Message;
