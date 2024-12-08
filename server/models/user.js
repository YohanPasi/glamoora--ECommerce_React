const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            default: 'user',
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt
);


const User = mongoose.model('User', UserSchema);

module.exports = User;
