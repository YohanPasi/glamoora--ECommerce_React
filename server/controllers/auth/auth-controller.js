const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

// Define JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

// Register a new user
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();

        // Check if the email is already registered
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            userName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful.',
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred.',
        });
    }
};

// Login a user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials: Email not found!',
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials: Incorrect password!',
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: '30m' }
        );

        // Send the token as a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        }).json({
            success: true,
            message: 'Login successful.',
            user: {
                id: existingUser._id,
                email: existingUser.email,
                userName: existingUser.userName,
                role: existingUser.role,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred.',
        });
    }
};

// Logout a user
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.json({
            success: true,
            message: 'Logout successful.',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
};

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please login first.',
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        // Enforce role-based restrictions
        if (req.originalUrl.startsWith('/admin') && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admins only.',
            });
        }

        if (req.originalUrl.startsWith('/shop') && req.user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Users only.',
            });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.',
            });
        }

        console.error('Error verifying token:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.',
        });
    }
};

module.exports = { registerUser, login, logout, authMiddleware };
