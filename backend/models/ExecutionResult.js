const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExecutionResult = sequelize.define("ExecutionResult", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: DataTypes.STRING(20),
    output: DataTypes.TEXT,
    error: DataTypes.TEXT,
    execution_time_ms: DataTypes.INTEGER,
    memory_used_kb: DataTypes.INTEGER,
}, {
    tableName: "execution_results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

module.exports = ExecutionResult;