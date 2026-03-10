const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", {
        expiresIn: "30d",
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
}

module.exports = {
    generateToken,
    verifyToken
}