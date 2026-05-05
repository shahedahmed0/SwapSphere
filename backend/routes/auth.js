const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/authController');


router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');


    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username email');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/niche
// @desc    Update user's hobby niche
// @access  Private
router.put('/niche', require('../middleware/auth'), async (req, res) => {
  try {
    const { hobbyNiche } = req.body;
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.hobbyNiche = hobbyNiche || 'General';
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Update niche error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;