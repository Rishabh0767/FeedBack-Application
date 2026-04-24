const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());          // Allow React frontend cross-origin requests
app.use(express.json()); // Parse incoming JSON bodies

// ── Routes ─────────────────────────────────────────────────────────────────
const authRoutes  = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Step 3
// Step 4 — reviewRoutes will be added here
// Step 5 — feedbackRoutes will be added here

app.use('/api/auth',  authRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// ── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
