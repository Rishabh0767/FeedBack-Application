const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * verifyToken
 * Protects routes by validating the JWT sent in the Authorization header.
 * Attach decoded user payload to req.user for downstream handlers.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Token format: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Malformed token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, role }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

/**
 * isAdmin
 * Must be used AFTER verifyToken.
 * Blocks access if the logged-in user is not an admin.
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
