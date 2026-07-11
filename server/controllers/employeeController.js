const { markAttendance, checkTodayAttendance, getAttendanceHistory } = require('../models/attendanceModel');
const { findUserById } = require('../models/userModel');
const { addProofOfWork, getWorkHistory, checkTodaySubmission } = require('../models/workModel');

// Apna profile/score dekhna
const getMyProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      performance_score: user.performance_score,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Proof of work submit karna
const submitWork = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { screenshotUrl, githubLink } = req.body;

    if (!screenshotUrl && !githubLink) {
      return res.status(400).json({ message: 'Screenshot or GitHub link is required' });
    }

    const existing = await checkTodaySubmission(userId, today);
    if (existing) {
      return res.status(400).json({ message: 'Work already submitted for today' });
    }

    const work = await addProofOfWork(userId, today, screenshotUrl, githubLink);
    res.status(201).json({ message: 'Work submitted successfully', work });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apni history dekhna
const myHistory = async (req, res) => {
  try {
    const history = await getWorkHistory(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyProfile, submitWork, myHistory };
// Attendance mark karna
const markMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const existing = await checkTodayAttendance(userId, today);
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = await markAttendance(userId, today);
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Attendance history dekhna
const myAttendanceHistory = async (req, res) => {
  try {
    const history = await getAttendanceHistory(req.user.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = { getMyProfile, submitWork, myHistory, markMyAttendance, myAttendanceHistory };