const User = require('../models/User');

// Get all employees (admin/manager)
exports.getAllEmployees = async (req, res) => {
  try {
    // Show all users except the one requesting
    const employees = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update employee profile
exports.updateEmployee = async (req, res) => {
  try {
    const { name, department, designation } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, department, designation },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leaderboard — top 10 by rewardPoints
exports.getLeaderboard = async (req, res) => {
  try {
    const top = await User.find({ role: 'employee' })
      .sort({ rewardPoints: -1 })
      .limit(10)
      .select('name department designation rewardPoints tier');
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
