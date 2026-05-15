const Attendance = require('../models/Attendance');

// Mark attendance (check-in)
exports.checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ employee: req.user.id, date: today });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    const now = new Date();
    const hour = now.getHours();
    const status = (hour > 9 || (hour === 9 && now.getMinutes() > 15)) ? 'Late' : 'Present';
    const checkInTime = now.toTimeString().split(' ')[0];

    const points = status === 'Late' ? 3 : 5;
    const record = await Attendance.create({
      employee: req.user.id,
      date: today,
      checkIn: checkInTime,
      status,
      points,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check-out
exports.checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ employee: req.user.id, date: today });
    if (!record) return res.status(404).json({ message: 'No check-in found for today' });

    record.checkOut = new Date().toTimeString().split(' ')[0];
    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user.id }).sort({ date: -1 }).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all attendance (admin/manager)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('employee', 'name department').sort({ date: -1 }).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get today's attendance status
exports.getTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ employee: req.user.id, date: today }).lean();
    res.json(record || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
