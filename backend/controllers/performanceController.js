const Performance = require('../models/Performance');

// Submit / update performance (manager)
exports.submitPerformance = async (req, res) => {
  try {
    const { employeeId, month, score } = req.body;
    
    let record = await Performance.findOne({ employee: employeeId, month });
    if (record) {
      record.overallScore = score;
      record.reviewedBy = req.user.id;
      await record.save();
    } else {
      record = await Performance.create({ 
        employee: employeeId, 
        month, 
        overallScore: score,
        reviewedBy: req.user.id 
      });
    }
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my performance history
exports.getMyPerformance = async (req, res) => {
  try {
    const records = await Performance.find({ employee: req.user.id }).sort({ month: -1 }).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all performance (admin)
exports.getAllPerformance = async (req, res) => {
  try {
    const records = await Performance.find().populate('employee', 'name department designation').sort({ month: -1 }).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
