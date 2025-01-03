const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Sequelize model

const authenticateUser = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        // Fetch user details from MySQL using Sequelize
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error(err.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
