require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./config/database");
require("./models"); // load associations
const authRoutes  = require("./routes/authRoutes");
const userRoutes  = require("./routes/userRoutes");
const roomRoutes  = require("./routes/roomRoutes");
const codeRoutes  = require("./routes/codeRoutes");
const setupSockets = require("./sockets/socketHandler");
const keepliveRouter = require("./routes/AliveServer");

const app = express();
const server = http.createServer(app);

const corsOptions = {
origin: true,
  credentials: true,
  maxAge: 86400,  // 24 hours
};

// 🔹 Setup WebSockets
setupSockets(server);
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/keepalive", keepliveRouter);

// 🔹 Test DB Connection First (no sync — tables already exist on Aiven)
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log("✅ Connected to MySQL successfully");
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to database:", err.message);
        // Still start the server so Render doesn't mark it as crashed
        server.listen(PORT, () => {
            console.log(`⚠️ Server running on port ${PORT} (DB connection failed)`);
        });
    });