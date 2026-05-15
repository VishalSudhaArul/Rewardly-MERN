const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, designation } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, department, designation });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, tier: user.tier, rewardPoints: user.rewardPoints } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, designation: user.designation, tier: user.tier, rewardPoints: user.rewardPoints } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
