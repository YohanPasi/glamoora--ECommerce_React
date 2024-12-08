const express = require('express');
const { registerUser, login, logout, authMiddleware } = require("../../controllers/auth/auth-controller.js");

const router = express.Router();

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', login);

// Logout Route
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
        res.status(200).json({
            success: true,
            message: 'Logout successful.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred during logout.',
        });
    }
});

// Check Authentication
router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;

    if (user.role === 'admin') {
        return res.status(200).json({
            success: true,
            message: 'You are authenticated as an admin.',
            user,
        });
    }

    if (user.role === 'user') {
        return res.status(200).json({
            success: true,
            message: 'You are authenticated as a user.',
            user,
        });
    }

    res.status(403).json({
        success: false,
        message: 'Role not recognized.',
    });
});

// Example of role-protected route
router.get('/admin/dashboard', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admins only.',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Welcome to the admin dashboard!',
    });
});

module.exports = router;
