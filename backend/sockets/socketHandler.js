const { Server } = require("socket.io");
const { verifyToken } = require("../services/autheService");
const User = require("../models/User");
const Message = require("../models/Message");

// In-memory store for connected users: userId -> socketId
const connectedUsers = new Map();

const setupSockets = (server) => {
    // Initialize socket.io with the HTTP server
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

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
        
        // Track the user
        connectedUsers.set(socket.user.id, socket.id);

        // Join a specific chat room
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.user.username} joined room ${roomId}`);
        });

        // 🔹 Handle Sending a Message
        socket.on("send_message", async (data) => {
            try {
                const { room_id, content, message_type = "text" } = data;
                
                // 1. Save the new message to MySQL
                const newMessage = await Message.create({
                    sender_id: socket.user.id,
                    room_id: room_id,
                    content: content,
                    message_type: message_type
                });

                // Fetch sender data to include in the payload (optional but helpful for frontend)
                const senderDetails = {
                    id: socket.user.id,
                    username: socket.user.username,
                    profile_picture: socket.user.profile_picture
                };

                const messagePayload = {
                    ...newMessage.toJSON(),
                    sender: senderDetails
                };

                // 2. Broadcast to all users in the specific room
                io.to(room_id).emit("receive_message", messagePayload);
            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        }); 

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.user.username}`);
            connectedUsers.delete(socket.user.id);
        });
    });

    return io;
};

module.exports = setupSockets;
