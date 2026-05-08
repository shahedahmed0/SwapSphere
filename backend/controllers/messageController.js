const Message = require('../models/Message');


exports.getMessages = async (req, res) => {
  try {
    const { swapId } = req.params;

    if (!swapId) {
      return res.status(400).json({ msg: 'Swap ID is required' });
    }

    const messages = await Message.find({ swapId }).
    populate('userId', 'username email').
    sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.createMessage = async (messageData) => {
  try {
    const { swapId, userId, username, text, timestamp } = messageData;

    const newMessage = new Message({
      swapId,
      userId,
      username,
      text,
      timestamp: timestamp ? new Date(timestamp) : Date.now()
    });

    const message = await newMessage.save();
    return message;
  } catch (err) {
    console.error('Error saving message:', err.message);
    throw err;
  }
};
