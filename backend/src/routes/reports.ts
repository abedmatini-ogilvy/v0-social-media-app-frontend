import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createReport, getMyReports } from '../controllers/reportController';

const router = Router();

// All report routes require authentication
router.use(authenticate);

// Create a report
router.post('/', createReport);

// Get user's submitted reports
router.get('/my-reports', getMyReports);

export default router;
