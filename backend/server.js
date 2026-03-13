require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./config/database");
require("./models"); // load associations
const authRoutes  = require("./routes/authRoutes");
const setupSockets = require("./sockets/socketHandler");

const app = express();
const server = http.createServer(app);

// 🔹 Setup WebSockets
setupSockets(server);
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// 🔹 Test DB Connection First
sequelize.authenticate()
    .then(() => {
        console.log("✅ Connected to MySQL successfully");

        // 🔹 Sync Models
        return sequelize.sync();
    })
    .then(() => {
        console.log("✅ Database synced successfully");

        // 🔹 Start Server ONLY after DB is ready
        server.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to database:", err);
    });