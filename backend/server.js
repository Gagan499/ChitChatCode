require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("./models"); // load associations
const authRoutes  = require("./routes/authRoutes");

const app = express();
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
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to database:", err);
    });