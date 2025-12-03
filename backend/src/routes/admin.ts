import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  // User management
  getAllUsers,
  getUserById,
  updateUser,
  banUser,
  unbanUser,
  suspendUser,
  deleteUser,
  resetUserPassword,
  // Reports
  getAllReports,
  getReportById,
  reviewReport,
  deleteReport,
  // Announcements
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  // Analytics
  getOverviewStats,
  getUserAnalytics,
  getPostAnalytics,
  getReportAnalytics,
} from '../controllers/adminController.js';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} from '../controllers/eventController.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/unban', unbanUser);
router.post('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);

// ============================================
// REPORTS ROUTES
// ============================================
router.get('/reports', getAllReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id', reviewReport);
router.delete('/reports/:id', deleteReport);

// ============================================
// ANNOUNCEMENTS ROUTES
// ============================================
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.post('/announcements/:id/publish', publishAnnouncement);

// ============================================
// ANALYTICS ROUTES
// ============================================
router.get('/analytics/overview', getOverviewStats);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/posts', getPostAnalytics);
router.get('/analytics/reports', getReportAnalytics);

// ============================================
// EVENTS ROUTES
// ============================================
router.post('/events', createEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);
router.get('/events/:eventId/attendees', getEventAttendees);

export default router;
