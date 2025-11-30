import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as jobController from '../controllers/jobController.js';

const router = Router();

// Public routes
router.get('/', jobController.listJobs);
router.get('/my-applications', authenticate, jobController.getMyJobApplications);
router.get('/:jobId', jobController.getJob);
router.post('/:jobId/apply', authenticate, jobController.applyForJob);

export default router;
