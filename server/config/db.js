const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_tracking';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Primary MongoDB not reachable (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`InMemory MongoDB Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`MongoDB Connection Error: ${memErr.message}`);
    }
  }

  // Auto-seed initial admin and employee accounts
  setTimeout(async () => {
    try {
      const { User } = require('../models/userModel');
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const adminPass = await bcrypt.hash('admin123', 10);
        await User.create({
          name: 'System Admin',
          email: 'admin@emptrack.com',
          password_hash: adminPass,
          role: 'admin',
          performance_score: 100,
          status: 'active'
        });
        console.log('Seeded default Admin: admin@emptrack.com / admin123');
      }

      const employeeCount = await User.countDocuments({ role: 'employee' });
      if (employeeCount === 0) {
        const empPass = await bcrypt.hash('employee123', 10);
        await User.create({
          name: 'John Doe',
          email: 'employee@emptrack.com',
          password_hash: empPass,
          role: 'employee',
          performance_score: 100,
          status: 'active'
        });
        console.log('Seeded default Employee: employee@emptrack.com / employee123');
      }
    } catch (seedErr) {
      console.error('Seeding error:', seedErr.message);
    }
  }, 1000);
};

connectDB();

module.exports = mongoose;