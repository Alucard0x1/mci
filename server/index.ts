import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDb } from './db/schema';
import { seed } from './db/seed';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import publicRoutes from './routes/public';
import dashboardRoutes from './routes/dashboard';
import partnerRoutes from './routes/partners';
import instructorRoutes from './routes/instructors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB & seed
initDb();
seed();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`MCI Backend running on http://localhost:${PORT}`);
});
