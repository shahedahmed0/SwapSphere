const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const cors = require('cors');
require('dotenv').config();

// Import controllers
const { createMessage } = require('./controllers/messageController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// make sure uploads folder exists so multer can write files
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// serve uploaded images from the /uploads path
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
// Ensure Node uses reliable DNS servers for SRV lookups
app.use('/uploads', express.static(uploadsDir));

dns.setServers(['1.1.1.1', '8.8.8.8']);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mernapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => { console.log('MongoDB connected'); })
.catch(err => { console.error('MongoDB connection error', err); });

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/items', require('./routes/items'));
app.use('/api/items', require('./routes/items'));
app.use('/api/swaps', require('./routes/swapRoutes'));

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_URL || "http://localhost:3000", // React App URL
    credentials: true,
    methods: ["GET", "POST"]
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or set a different PORT in .env.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

io.on('connection', (socket) => {

  socket.join('notifications');

  socket.on('join_chat', async (data) => {
    const { swapId } = data;
    socket.join(swapId);

    try {
      const Message = require('./models/Message');
      const previousMessages = await Message.find({ swapId })
        .sort({ timestamp: 1 });
      socket.emit('load_messages', previousMessages);
    } catch (err) {
    }
  });

  socket.on('send_message', async (data) => {
    if (!data.swapId) {
      return;
    }

    const messageData = {
      swapId: data.swapId,
      text: data.text,
      userId: data.userId,
      username: data.username,
      timestamp: data.timestamp || new Date().toISOString()
    };

    try {
      const savedMessage = await createMessage(messageData);
      
      // Broadcast message to all users in the swap negotiation room
      io.to(data.swapId).emit('receive_message', savedMessage);
      
      socket.broadcast.to('notifications').emit('new_notification', {
        message: `New message in swap negotiation from ${data.username}: ${data.text.substring(0, 20)}...`,
        swapId: data.swapId,
        userId: data.userId,
        username: data.username
      });
    } catch (err) {
      socket.emit('error', { msg: 'Failed to save message' });
    }
  });

  socket.on('disconnect', () => {});
});

