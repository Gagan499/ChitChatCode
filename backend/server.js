const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("./models"); // load associations

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));


const PORT = 5000;

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
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to database:", err);
    });