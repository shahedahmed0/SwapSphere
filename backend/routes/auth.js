const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { registerUser, loginUser } = require('../controllers/authController');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    // If no token, access is denied
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// Get user by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username email');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
