const User = require('../models/userModel');

// GET all users (sorted by role and name)
// GET all users (grouped by role)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ name: 1 })
      .select('id role name');

    // Group users by role
    const groupedUsers = {
      Admin: users.filter(u => u.role === 'Admin'),
      Member: users.filter(u => u.role === 'Member')
    };

    res.status(200).json(groupedUsers);
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
    const { id, name, email, role, project_role } = req.body;
    if (!id || !name || !email || !role || (role === 'Member' && !project_role)) {
        return res.status(400).json({ error: 'All fields (id, role, name, email, project_role) are required for members' });
    }
    try {
        const existingUser = await User.findOne({ id });
        if (existingUser) {
            return res.status(409).json({ error: 'User ID already exists' });
        }
        const user = await User.create({ id, role, name, email, project_role });
        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

// User login
// Fix loginUser:
const loginUser = async (req, res) => {
  const { id } = req.body; // Use only ID for login

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
  message: 'Login successful',
  redirectUrl: user.role && user.role.toLowerCase() === 'admin' ? '/admdash' : '/memdash',
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    project_role: user.project_role 
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