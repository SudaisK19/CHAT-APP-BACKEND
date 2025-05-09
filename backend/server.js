// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// route imports
const chatRoutes    = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

// error middleware imports
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// Register User model for populate
require('./models/userModel');
app.use(cors());
app.use(express.json());

// REST API routes
app.use('/api/chat',     chatRoutes);
app.use('/api/messages', messageRoutes);

// 404 Not Found middleware
app.use(notFound);

// Global Error Handler middleware
app.use(errorHandler);

// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'] }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', chatId => {
    socket.join(chatId);
  });

  socket.on('send_message', msg => {
    // msg should include chatId, content, senderId, timestamp, etc.
    io.to(msg.chatId).emit('new_message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
