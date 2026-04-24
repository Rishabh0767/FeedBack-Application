const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);


router.post('/logout', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
