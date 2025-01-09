const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Sequelize model

const authenticateUser = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. Token is required." });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database using the decoded ID
        const user = await User.findByPk(decoded.id, {
            attributes: ["id", "username", "email", "photo", "age", "description"],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Attach the user to the request object for downstream usage
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error("Error in authentication middleware:", err.message);

        // Handle token expiration errors specifically
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please log in again." });
        }

        // Handle other token-related errors
        res.status(401).json({ error: "Invalid token. Please log in again." });
    }
};

module.exports = authenticateUser;
