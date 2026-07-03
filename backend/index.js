import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import authMiddleware from './middleware.js';
import connectDB from './connect.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', authMiddleware, workspaceRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});