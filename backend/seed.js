const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Performance = require('./models/Performance');
const Feedback = require('./models/Feedback');
const Reward = require('./models/Reward');

const seed = async () => {
  try {
    console.log('🚀 Starting Data Seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing
    await Promise.all([
      User.deleteMany({}),
      Attendance.deleteMany({}),
      Performance.deleteMany({}),
      Feedback.deleteMany({}),
      Reward.deleteMany({})
    ]);
    console.log('🧹 Existing data cleared');

    const hashed = await bcrypt.hash('password123', 10);

    // Create Users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@rewardly.com', password: hashed, role: 'admin', department: 'Executive', rewardPoints: 0, pointsEarned: 0 },
      { name: 'Dept Manager', email: 'manager@rewardly.com', password: hashed, role: 'manager', department: 'Engineering', designation: 'Engineering Manager', rewardPoints: 0, pointsEarned: 0 },
      { name: 'Sarah Miller', email: 'sarah@rewardly.com', password: hashed, role: 'employee', department: 'Engineering', designation: 'Sr. SDE', rewardPoints: 850, pointsEarned: 850, tier: 'Silver' },
      { name: 'David Chen', email: 'david@rewardly.com', password: hashed, role: 'employee', department: 'Marketing', designation: 'Lead Designer', rewardPoints: 1200, pointsEarned: 1200, tier: 'Gold' },
      { name: 'Priya Sharma', email: 'priya@rewardly.com', password: hashed, role: 'employee', department: 'Human Resources', designation: 'HR Specialist', rewardPoints: 450, pointsEarned: 450, tier: 'Bronze' },
      { name: 'Michael Ross', email: 'michael@rewardly.com', password: hashed, role: 'employee', department: 'Engineering', designation: 'SDE-2', rewardPoints: 150, pointsEarned: 150, tier: 'Standard' },
      { name: 'Emily Blunt', email: 'emily@rewardly.com', password: hashed, role: 'employee', department: 'Sales', designation: 'Account Manager', rewardPoints: 600, pointsEarned: 600, tier: 'Bronze' },
      { name: 'James Bond', email: 'james@rewardly.com', password: hashed, role: 'employee', department: 'Operations', designation: 'Operations Lead', rewardPoints: 950, pointsEarned: 950, tier: 'Silver' },
      { name: 'Bruce Wayne', email: 'bruce@rewardly.com', password: hashed, role: 'employee', department: 'Engineering', designation: 'Tech Architect', rewardPoints: 2100, pointsEarned: 2100, tier: 'Gold' },
      { name: 'Clark Kent', email: 'clark@rewardly.com', password: hashed, role: 'employee', department: 'Marketing', designation: 'Content Strategist', rewardPoints: 300, pointsEarned: 300, tier: 'Standard' },
    ]);
    console.log('👥 Users created');

    const month = '2026-05';
    const dates = ['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05'];

    // Create Attendance
    for (const user of users) {
      if (user.role === 'admin') continue;
      await Attendance.create(dates.map(date => ({
        employee: user._id,
        date,
        checkIn: '09:05:00',
        checkOut: '18:10:00',
        status: 'Present',
        points: 5
      })));
    }
    console.log('📅 Attendance logs created');

    // Professional Manager Notes
    const notes = [
      "Consistently exceeds performance targets and shows great leadership potential.",
      "Excellent technical skills and a valuable team player. Always meets deadlines.",
      "Highly creative and detail-oriented. Successfully led the recent design sprint.",
      "Outstanding contribution to the core architecture. Great mentor for junior devs.",
      "Very reliable and punctual. Shows great initiative in solving complex bugs.",
      "Proactive in communication and consistently delivers high-quality documentation.",
      "Great improvement in productivity this month. Keeping up the good work!",
      "Expertly handled client requirements and delivered the project ahead of schedule."
    ];

    // Create Performance (Professional Data)
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.role === 'admin') continue;

      const targetAchievement = Math.floor(Math.random() * 20) + 80; // 80-100
      const qualityScore = Math.floor(Math.random() * 25) + 75;      // 75-100
      const teamworkScore = Math.floor(Math.random() * 30) + 70;     // 70-100
      const punctualityScore = Math.floor(Math.random() * 10) + 90;  // 90-100
      const overallScore = Math.round((targetAchievement + qualityScore + teamworkScore + punctualityScore) / 4);

      await Performance.create({
        employee: user._id,
        month,
        targetAchievement,
        qualityScore,
        teamworkScore,
        punctualityScore,
        overallScore,
        managerNotes: notes[i % notes.length],
        reviewedBy: users[1]._id // Reviewed by Manager
      });
    }
    console.log('📈 Professional performance metrics created');

    // Create Feedback
    await Feedback.create([
      { fromUser: users[1]._id, toEmployee: users[2]._id, comment: 'Exceptional work on the API optimization. Performance improved by 40%.', rating: 5, month },
      { fromUser: users[3]._id, toEmployee: users[1]._id, comment: 'Manager David provides very clear direction and supports the team well.', rating: 5, month },
      { fromUser: users[2]._id, toEmployee: users[4]._id, comment: 'Priya did a great job coordinating the HR workshop last week.', rating: 4, month },
    ]);
    console.log('💬 Peer feedback created');

    // Create Rewards (History)
    for (const user of users) {
      if (user.role === 'admin') continue;
      await Reward.create({
        employee: user._id,
        month,
        totalPoints: user.rewardPoints,
        tier: user.tier,
        status: 'Approved'
      });
    }
    console.log('🎁 Reward history created');

    console.log('✨ SEEDING COMPLETE! You can now log in with:');
    console.log('   Admin: admin@rewardly.com / password123');
    console.log('   Employee: david@rewardly.com / password123');
    
    process.exit();
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seed();
