const express = require('express');
const router = express.Router();

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    removeEmployee
} = require('../controllers/adminController');

// All admin routes require a valid JWT AND admin role
router.use(verifyToken, isAdmin);

// GET    /api/admin/employees        — List all employees
router.get('/employees', getAllEmployees);

// GET    /api/admin/employees/:id    — Get a single employee
router.get('/employees/:id', getEmployeeById);

// POST   /api/admin/employees        — Add a new employee
router.post('/employees', addEmployee);

// PUT    /api/admin/employees/:id    — Update employee username/password
router.put('/employees/:id', updateEmployee);

// DELETE /api/admin/employees/:id    — Remove an employee
router.delete('/employees/:id', removeEmployee);

module.exports = router;
