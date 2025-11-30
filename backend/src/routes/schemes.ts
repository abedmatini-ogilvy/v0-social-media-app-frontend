import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as schemeController from '../controllers/schemeController.js';

const router = Router();

// Public routes
router.get('/', schemeController.listSchemes);
router.get('/my-applications', authenticate, schemeController.getMyApplications);
router.get('/applications/:applicationId', authenticate, schemeController.getApplicationStatus);
router.get('/:schemeId', schemeController.getScheme);
router.post('/:schemeId/apply', authenticate, schemeController.applyForScheme);

export default router;
