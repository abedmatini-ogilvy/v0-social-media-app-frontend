import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { getPublishedAnnouncements } from '../controllers/reportController';

const router = Router();

// Get published announcements (public endpoint)
router.get('/', optionalAuth, getPublishedAnnouncements);

export default router;
