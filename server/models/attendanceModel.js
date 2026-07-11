const pool = require('../config/db');

// Attendance mark karta hai
const markAttendance = async (userId, date) => {
  const result = await pool.query(
    'INSERT INTO attendance (user_id, date) VALUES ($1, $2) RETURNING *',
    [userId, date]
  );
  return result.rows[0];
};

// Check karta hai aaj already mark ho chuki hai ya nahi
const checkTodayAttendance = async (userId, date) => {
  const result = await pool.query(
    'SELECT * FROM attendance WHERE user_id = $1 AND date = $2',
    [userId, date]
  );
  return result.rows[0];
};

// User ki poori attendance history
const getAttendanceHistory = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

module.exports = { markAttendance, checkTodayAttendance, getAttendanceHistory };