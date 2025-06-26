const User = require('../models/userModel');

// GET all users (sorted by role and name)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ role: 1, name: 1 })
            .select('id role name'); // Only return necessary fields

        const formattedUsers = users.reduce((acc, user) => {
            if (!acc[user.role]) acc[user.role] = [];
            acc[user.role].push({ id: user.id, name: user.name });
            return acc;
        }, {});

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET single user by custom id
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new user
const createUser = async (req, res) => {
    const { id, role, name } = req.body;
    
    if (!id || !role || !name) {
        return res.status(400).json({ error: 'All fields (id, role, name) are required' });
    }

    try {
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(409).json({ error: 'User ID already exists' });
        }

        const user = await User.create({ id, role, name });
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// User login
const loginUser = async (req, res) => {
    const { id, role } = req.body;

    if (!id || !role) {
        return res.status(400).json({ error: 'ID and role are required' });
    }

    try {
        const user = await User.findOne({ id, role });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            redirectUrl: role === 'Admin' ? '/admdash' : '/memdash',
            user: {
                id: user.id,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user by custom id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete all users (protected route)
const deleteAllUsers = async (req, res) => {
    try {
        // Add admin verification in production
        // if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
        
        await User.deleteMany({});
        res.status(204).end(); // 204 No Content is standard for successful deletions
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user details
const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { 
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    deleteAllUsers,
    updateUser,
    loginUser
};