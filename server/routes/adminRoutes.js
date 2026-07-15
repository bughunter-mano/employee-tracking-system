const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  listEmployees,
  viewEmployee,
  addEmployee,
  editEmployee,
  removeEmployee,
  overrideScore
} = require('../controllers/adminController');

router.get('/employees', protect, adminOnly, listEmployees);
router.get('/employees/:id', protect, adminOnly, viewEmployee);
router.post('/employees', protect, adminOnly, addEmployee);
router.put('/employees/:id', protect, adminOnly, editEmployee);
router.delete('/employees/:id', protect, adminOnly, removeEmployee);
router.put('/employees/:id/score', protect, adminOnly, overrideScore);

module.exports = router;