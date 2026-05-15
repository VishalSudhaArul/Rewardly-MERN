const Attendance = require('../models/Attendance');
const Performance = require('../models/Performance');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.getPersonalAudit = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = new Date().toISOString().slice(0, 7);

    const [attendance, performance, feedbacks, user] = await Promise.all([
      Attendance.find({ employee: userId, date: { $regex: month } }),
      Performance.findOne({ employee: userId, month }),
      Feedback.find({ toEmployee: userId, month }),
      User.findById(userId)
    ]);

    // Simple AI logic
    let efficiency = 85; // base
    let strengths = [];
    let improvements = [];

    // Attendance analysis
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    if (presentDays > 10) {
      efficiency += 5;
      strengths.push("Consistent attendance");
    } else {
      improvements.push("Try to improve your daily check-ins");
    }

    // Performance analysis
    if (performance && performance.overallScore > 80) {
      efficiency += 5;
      strengths.push("High performance output");
    }

    // Feedback analysis
    if (feedbacks.length > 2) {
      efficiency += 4;
      strengths.push("Great team player");
    } else {
      improvements.push("Seek more peer feedback to grow");
    }

    efficiency = Math.min(efficiency, 100);

    const nextTier = user.tier === 'Standard' ? 'Bronze' : user.tier === 'Bronze' ? 'Silver' : 'Gold';
    
    const message = `Our AI has analyzed your ${new Date().toLocaleString('default', { month: 'long' })} performance. 
      You have ${strengths.length > 0 ? 'shown ' + strengths.join(', ') : 'been working hard'}. 
      To reach the ${nextTier} tier faster, we recommend: ${improvements.length > 0 ? improvements.join(' and ') : 'maintaining your current momentum'}. 
      Keep up the great work!`;

    res.json({
      efficiency,
      nextTier,
      message,
      auditDate: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
