const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register  — Create a new user (admin or employee)
router.post('/register', register);

// POST /api/auth/login     — Authenticate and receive a JWT
router.post('/login', login);

// GET  /api/auth/me        — Get current user profile (protected)
router.get('/me', verifyToken, getMe);

// POST /api/auth/logout    — Client-side logout (just discard the token)
// No server action needed; the JWT is stateless. This is a placeholder
// for clarity and future token-blacklisting if needed.
router.post('/logout', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully. Please delete your token on the client.' });
});

module.exports = router;
