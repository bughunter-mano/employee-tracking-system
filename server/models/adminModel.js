const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Saare employees (Admin ko sab dikhne chahiye)
const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, role, performance_score, status, created_at FROM users WHERE role = 'employee' ORDER BY created_at DESC"
  );
  return result.rows;
};

// Ek specific employee ka poora detail (submissions/attendance ke sath)
const getEmployeeDetail = async (id) => {
  const user = await pool.query('SELECT id, name, email, role, performance_score, status FROM users WHERE id = $1', [id]);
  const work = await pool.query('SELECT * FROM proof_of_work WHERE user_id = $1 ORDER BY date DESC LIMIT 10', [id]);
  const attendance = await pool.query('SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC LIMIT 10', [id]);
  return { user: user.rows[0], workHistory: work.rows, attendanceHistory: attendance.rows };
};

// Naya employee Admin khud bana sake
const createEmployeeByAdmin = async (name, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role || 'employee']
  );
  return result.rows[0];
};

// Employee ki details edit karna (naam/email)
const updateEmployee = async (id, name, email) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
    [name, email, id]
  );
  return result.rows[0];
};

// Employee delete karna
const deleteEmployee = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

module.exports = { getAllUsers, getEmployeeDetail, createEmployeeByAdmin, updateEmployee, deleteEmployee };