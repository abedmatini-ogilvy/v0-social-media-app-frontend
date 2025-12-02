import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import schemeRoutes from './routes/schemes.js';
import jobRoutes from './routes/jobs.js';
import eventRoutes from './routes/events.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';
import searchRoutes from './routes/search.js';
import emergencyAlertRoutes from './routes/emergencyAlerts.js';
import uploadRoutes from './routes/upload.js';
import adminRoutes from './routes/admin.js';
import reportRoutes from './routes/reports.js';
import announcementRoutes from './routes/announcements.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check endpoint (excluded from rate limiting)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/emergency-alerts', emergencyAlertRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/announcements', announcementRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
    },
  });
});

// Error handler
app.use(errorHandler);

export default app;
