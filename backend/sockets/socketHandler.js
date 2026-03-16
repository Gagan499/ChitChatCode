const { Server } = require("socket.io");
const { verifyToken } = require("../services/autheService");
const User = require("../models/User");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

// In-memory store for connected users: userId -> { socketId, status }
const connectedUsers = new Map();

const VALID_STATUSES = new Set(["online", "away", "busy", "offline"]);

const setupSockets = (server) => {
    // Initialize socket.io with the HTTP server
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const sendRoomHistory = async (socket, roomId) => {
        try {
            const messages = await Message.findAll({
                where: { room_id: roomId },
                order: [["created_at", "ASC"]],
                include: [{ model: User, attributes: ["id", "username"] }],
            });
            const normalized = messages.map((m) => ({
                id: m.id,
                content: m.content,
                messageType: m.message_type,
                time: m.created_at,
                sender: {
                    id: m.User?.id,
                    username: m.User?.username,
                    avatar: null,
                },
            }));
            socket.emit("room:history", { roomId, messages: normalized });
        } catch (err) {
            console.warn("Failed to send room history", err);
        }
    };

    // 🔹 Middleware for authentication using JWT
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }
            
            // Verify the JWT
            const decoded = verifyToken(token);
            if (!decoded || !decoded.id) {
                return next(new Error("Authentication error: Invalid token"));
            }

            // Fetch user from DB (excluding password)
            const user = await User.findByPk(decoded.id, {
                attributes: { exclude: ["password_hash"] }
            });

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            // Attach user to the socket instance for later use
            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket Auth Error:", error.message);
            next(new Error("Authentication error"));
        }
    });

    // 🔹 Handle Connection Events
    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.user.username} (${socket.id})`);
        
        // Track the user (default status is online on connect)
        connectedUsers.set(socket.user.id, { socketId: socket.id, status: "online" });

        // Send current presence state to the newly connected user
        socket.emit("presence:state", {
          online: Array.from(connectedUsers.entries()).map(([userId, { status }]) => ({ userId, status })),
        });

        // Broadcast presence update (including status)
        io.emit("presence:update", { userId: socket.user.id, status: "online" });

        // Listen for client status updates (online/away/busy/offline)
        socket.on("presence:set", ({ status }) => {
            if (!status || !VALID_STATUSES.has(status)) return;
            connectedUsers.set(socket.user.id, { socketId: socket.id, status });
            io.emit("presence:update", { userId: socket.user.id, status });
        });

        // Join a specific chat room
        socket.on("room:join", async ({ roomId }) => {
            if (!roomId) return;
            socket.join(roomId);
            console.log(`User ${socket.user.username} joined room ${roomId}`);

            // Send history to the joiner
            await sendRoomHistory(socket, roomId);
        });

        socket.on("room:leave", ({ roomId }) => {
            if (!roomId) return;
            socket.leave(roomId);
            console.log(`User ${socket.user.username} left room ${roomId}`);
        });

        // Typing indicator
        socket.on("typing:start", ({ roomId }) => {
            if (!roomId) return;
            socket.to(roomId).emit("typing:start", { roomId, userId: socket.user.id, username: socket.user.username });
        });
        socket.on("typing:stop", ({ roomId }) => {
            if (!roomId) return;
            socket.to(roomId).emit("typing:stop", { roomId, userId: socket.user.id });
        });

        // 🔹 Handle Sending a Message
        socket.on("message:send", async ({ roomId, content, messageType = "text" }) => {
            try {
                if (!roomId || !content?.trim()) return;

                // Ensure associated chat room exists (so message FK is valid)
                await ChatRoom.findOrCreate({
                    where: { id: roomId },
                    defaults: { name: roomId, created_by: socket.user.id },
                });

                // Save the new message to MySQL
                const newMessage = await Message.create({
                    sender_id: socket.user.id,
                    room_id: roomId,
                    content,
                    message_type: messageType,
                });

                // Fetch sender data to include in the payload (optional but helpful for frontend)
                const senderDetails = {
                    id: socket.user.id,
                    username: socket.user.username,
                    avatar: null,
                };

                const messagePayload = {
                    id: newMessage.id,
                    roomId,
                    content: newMessage.content,
                    messageType: newMessage.message_type,
                    time: newMessage.created_at,
                    sender: senderDetails,
                };

                // Broadcast to all users in the specific room
                io.to(roomId).emit("message:new", messagePayload);
            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.user.username}`);
            connectedUsers.delete(socket.user.id);
            io.emit("presence:update", { userId: socket.user.id, status: "offline" });
        });
    });

    return io;
};

module.exports = setupSockets;
