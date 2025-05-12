// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/messageModel');

const chatRoutes    = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api/chat',     chatRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET','POST'],
    credentials: true
  }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join_chat', chatId => {
    socket.join(chatId);
  });

  socket.on('send_message', async (msg) => {
    try {
      const saved = await Message.create({
        chat:      msg.chatId,
        sender:    msg.senderId,
        content:   msg.content,
        timestamp: msg.timestamp
      });
      socket.to(msg.chatId).emit('new_message', saved);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
