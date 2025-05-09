// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// route imports…
const chatRoutes    = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();
const app = express();

// —– CORS setup: only your Next.js app, and allow cookies —–
app.use(cors({
  origin: [
    'http://localhost:3000',  
    'https://your-production-frontend.com'
  ],
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// REST API routes
app.use('/api/chat',     chatRoutes);
app.use('/api/messages', messageRoutes);

// error handlers…
app.use(notFound);
app.use(errorHandler);

// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000','https://your-production-frontend.com'],
    methods: ['GET','POST'],
    credentials: true
  }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);
  socket.on('join_chat', chatId => socket.join(chatId));
  socket.on('send_message', msg => io.to(msg.chatId).emit('new_message', msg));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
