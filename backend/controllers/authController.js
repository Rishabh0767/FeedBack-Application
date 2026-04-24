const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '8h'; // Token valid for 8 hours


const register = async (req, res) => {
    const { username, password, role } = req.body;


    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const validRoles = ['admin', 'employee'];
    const userRole = validRoles.includes(role) ? role : 'employee';

    try {

        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }


        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);


        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, userRole]
        );

        res.status(201).json({
            message: 'User registered successfully.',
            userId: result.insertId,
            username,
            role: userRole
        });
    } catch (err) {
        console.error('[register] DB error:', err.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


const login = async (req, res) => {
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {

        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = rows[0];


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }


        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('[login] DB error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
const getMe = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, username, role FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error('[getMe] DB error:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { register, login, getMe };
