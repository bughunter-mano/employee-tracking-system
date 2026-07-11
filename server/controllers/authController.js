const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check karo email pehle se exist to nahi karti
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Password ko encrypt (hash) karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // User database mein banao
    const newUser = await createUser(name, email, hashedPassword, role || 'employee');

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Password compare karo (hashed version se)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Agar account blocked hai (score 30% se neeche)
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account blocked. Contact Admin.' });
    }

    // JWT Token banao
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, performance_score: user.performance_score }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login };