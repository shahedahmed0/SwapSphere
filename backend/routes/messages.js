const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');

// Get all messages for a specific swap negotiation
router.get('/:swapId', getMessages);

module.exports = router;
