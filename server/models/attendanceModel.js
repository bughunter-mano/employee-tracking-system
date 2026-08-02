const mongoose = require('mongoose');
require('../config/db');

const attendanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

attendanceSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

const markAttendance = async (userId, date) => {
  const attendance = new Attendance({ user_id: userId, date });
  await attendance.save();
  return attendance;
};

const checkTodayAttendance = async (userId, date) => {
  return await Attendance.findOne({ user_id: userId, date });
};

const getAttendanceHistory = async (userId) => {
  return await Attendance.find({ user_id: userId }).sort({ date: -1 });
};

module.exports = { Attendance, markAttendance, checkTodayAttendance, getAttendanceHistory };