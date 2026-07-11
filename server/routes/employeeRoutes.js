const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyProfile, submitWork, myHistory } = require('../controllers/employeeController');

router.get('/profile', protect, getMyProfile);
router.post('/submit-work', protect, submitWork);
router.get('/history', protect, myHistory);

module.exports = router;