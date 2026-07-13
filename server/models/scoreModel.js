const pool = require('../config/db');

// Saare active employees nikalta hai (sirf role = employee, admin nahi)
const getAllEmployees = async () => {
  const result = await pool.query(
    "SELECT * FROM users WHERE role = 'employee'"
  );
  return result.rows;
};

// Check karta hai kal (given date) proof-of-work submit hua tha ya nahi
const hasSubmittedOnDate = async (userId, date) => {
  const result = await pool.query(
    'SELECT * FROM proof_of_work WHERE user_id = $1 AND date = $2',
    [userId, date]
  );
  return result.rows.length > 0;
};

// Score update karta hai aur status bhi (active/warning/blocked)
const updateScore = async (userId, newScore, newStatus) => {
  const result = await pool.query(
    'UPDATE users SET performance_score = $1, status = $2 WHERE id = $3 RETURNING *',
    [newScore, newStatus, userId]
  );
  return result.rows[0];
};

// Score history mein ek record daalta hai (audit trail ke liye)
const logScoreChange = async (userId, oldScore, newScore, reason, changedBy) => {
  const result = await pool.query(
    'INSERT INTO score_history (user_id, old_score, new_score, reason, changed_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, oldScore, newScore, reason, changedBy]
  );
  return result.rows[0];
};

module.exports = { getAllEmployees, hasSubmittedOnDate, updateScore, logScoreChange };