const User = require("./User");
const ChatRoom = require("./ChatRoom");
const RoomMember = require("./RoomMember");
const Message = require("./Message");
const CodeSnippet = require("./CodeSnippet");
const ExecutionResult = require("./ExecutionResult");

/* One-to-Many */
User.hasMany(Message, { foreignKey: "sender_id" });
Message.belongsTo(User, { foreignKey: "sender_id" });

User.hasMany(CodeSnippet, { foreignKey: "user_id" });
CodeSnippet.belongsTo(User, { foreignKey: "user_id" });

ChatRoom.hasMany(Message, { foreignKey: "room_id" });
Message.belongsTo(ChatRoom, { foreignKey: "room_id" });

ChatRoom.hasMany(CodeSnippet, { foreignKey: "room_id" });
CodeSnippet.belongsTo(ChatRoom, { foreignKey: "room_id" });

CodeSnippet.hasOne(ExecutionResult, { foreignKey: "snippet_id" });
ExecutionResult.belongsTo(CodeSnippet, { foreignKey: "snippet_id" });

User.hasMany(ChatRoom, { foreignKey: "created_by" });
ChatRoom.belongsTo(User, { foreignKey: "created_by" });

/* Many-to-Many */
User.belongsToMany(ChatRoom, {
    through: RoomMember,
    foreignKey: "user_id"
});

ChatRoom.belongsToMany(User, {
    through: RoomMember,
    foreignKey: "room_id"
});

module.exports = {
    User,
    ChatRoom,
    RoomMember,
    Message,
    CodeSnippet,
    ExecutionResult
};