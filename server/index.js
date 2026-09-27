import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import testRoutes from './routes/test.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible
app.set('io', io);

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'QuizForge API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/test', testRoutes);

// Error handling
app.use(errorHandler);

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join-exam', (examId) => socket.join(`exam-${examId}`));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});
