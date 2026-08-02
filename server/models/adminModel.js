const bcrypt = require('bcrypt');
const { User } = require('./userModel');
const { ProofOfWork } = require('./workModel');
const { Attendance } = require('./attendanceModel');
require('../config/db');

// Saare employees (Admin ko sab dikhne chahiye)
const getAllUsers = async () => {
  return await User.find({ role: 'employee' }).sort({ created_at: -1 });
};

// Ek specific employee ka poora detail (submissions/attendance ke sath)
const getEmployeeDetail = async (id) => {
  const user = await User.findById(id);
  const work = await ProofOfWork.find({ user_id: id }).sort({ date: -1 }).limit(10);
  const attendance = await Attendance.find({ user_id: id }).sort({ date: -1 }).limit(10);
  return { user, workHistory: work, attendanceHistory: attendance };
};

// Naya employee Admin khud bana sake
const createEmployeeByAdmin = async (name, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password_hash: hashedPassword,
    role: role || 'employee'
  });
  await user.save();
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

// Employee ki details edit karna (naam/email)
const updateEmployee = async (id, name, email) => {
  const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
  return user ? { id: user.id, name: user.name, email: user.email } : null;
};

// Employee delete karna
const deleteEmployee = async (id) => {
  await User.findByIdAndDelete(id);
};

module.exports = { getAllUsers, getEmployeeDetail, createEmployeeByAdmin, updateEmployee, deleteEmployee };