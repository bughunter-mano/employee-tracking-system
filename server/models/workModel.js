const pool = require('../config/db');

// Proof of work save karta hai
const addProofOfWork = async (userId, date, screenshotUrl, githubLink) => {
  const result = await pool.query(
    'INSERT INTO proof_of_work (user_id, date, screenshot_url, github_link) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, date, screenshotUrl, githubLink]
  );
  return result.rows[0];
};

// User ki saari history nikalta hai
const getWorkHistory = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM proof_of_work WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

// Check karta hai aaj already submit ho chuka hai ya nahi
const checkTodaySubmission = async (userId, date) => {
  const result = await pool.query(
    'SELECT * FROM proof_of_work WHERE user_id = $1 AND date = $2',
    [userId, date]
  );
  return result.rows[0];
};

module.exports = { addProofOfWork, getWorkHistory, checkTodaySubmission };