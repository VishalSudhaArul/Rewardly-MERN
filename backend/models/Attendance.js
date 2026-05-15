const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  checkIn: { type: String, default: '' },
  checkOut: { type: String, default: '' },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
  points: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
