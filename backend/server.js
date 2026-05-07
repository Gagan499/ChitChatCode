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

// 🔹 CORS Configuration
const allowedOrigins = [
  "http://localhost:5174",        // Local dev - frontend
  "http://localhost:3000",        // Alternative local dev
  "http://localhost:5000",        // Local dev - same origin
  "https://chitchatcode-1.onrender.com",  // Production frontend on Render
  process.env.FRONTEND_URL,       // Dynamic frontend URL from env
].filter(Boolean);  // Remove undefined values

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

// 🔹 Test DB Connection First
sequelize.authenticate()
    .then(() => {
        console.log("✅ Connected to MySQL successfully");

        // 🔹 Sync Models
        return sequelize.sync({ alter: true });
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