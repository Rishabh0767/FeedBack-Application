const bcrypt = require('bcrypt');
const db = require('../db');

const SALT_ROUNDS = 10;

/**
 * GET /api/admin/employees
 * Returns all users with role 'employee'.
 */
const getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, username, role FROM users WHERE role = 'employee' ORDER BY id ASC"
        );
        res.status(200).json({ employees: rows });
    } catch (err) {
        console.error('[getAllEmployees] DB error:', err.message);
        res.status(500).json({ message: 'Server error fetching employees.' });
    }
};

/**
 * GET /api/admin/employees/:id
 * Returns a single employee by ID.
 */
const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT id, username, role FROM users WHERE id = ? AND role = 'employee'",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.status(200).json({ employee: rows[0] });
    } catch (err) {
        console.error('[getEmployeeById] DB error:', err.message);
        res.status(500).json({ message: 'Server error fetching employee.' });
    }
};

/**
 * POST /api/admin/employees
 * Creates a new employee account.
 * Body: { username, password }
 */
const addEmployee = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'employee')",
            [username, hashedPassword]
        );

        res.status(201).json({
            message: 'Employee created successfully.',
            employee: { id: result.insertId, username, role: 'employee' }
        });
    } catch (err) {
        console.error('[addEmployee] DB error:', err.message);
        res.status(500).json({ message: 'Server error creating employee.' });
    }
};

/**
 * PUT /api/admin/employees/:id
 * Updates an employee's username and/or password.
 * Body: { username?, password? }
 */
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ message: 'Provide at least one field to update (username or password).' });
    }

    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'employee'",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        // Build update query dynamically based on provided fields
        const fields = [];
        const values = [];

        if (username) {
            // Check the new username isn't taken by another user
            const [taken] = await db.query(
                'SELECT id FROM users WHERE username = ? AND id != ?',
                [username, id]
            );
            if (taken.length > 0) {
                return res.status(409).json({ message: 'Username already taken.' });
            }
            fields.push('username = ?');
            values.push(username);
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters.' });
            }
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            fields.push('password = ?');
            values.push(hashedPassword);
        }

        values.push(id); // for WHERE clause
        await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

        res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (err) {
        console.error('[updateEmployee] DB error:', err.message);
        res.status(500).json({ message: 'Server error updating employee.' });
    }
};

/**
 * DELETE /api/admin/employees/:id
 * Removes an employee and cascades to their reviews/feedback (via FK ON DELETE CASCADE).
 */
const removeEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE id = ? AND role = 'employee'",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.status(200).json({ message: 'Employee removed successfully.' });
    } catch (err) {
        console.error('[removeEmployee] DB error:', err.message);
        res.status(500).json({ message: 'Server error removing employee.' });
    }
};

module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, removeEmployee };
