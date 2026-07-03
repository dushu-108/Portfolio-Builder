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
const allowedOrigins = [
  'http://localhost:5173',
  'https://portfolio-builder-flame-pi.vercel.app'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed for origin: ' + origin), false);
    }
    return callback(null, true);
  },
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