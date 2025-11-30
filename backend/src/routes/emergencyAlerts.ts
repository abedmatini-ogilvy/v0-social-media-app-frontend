import { Router } from 'express';
import * as emergencyAlertController from '../controllers/emergencyAlertController.js';

const router = Router();

// Public routes
router.get('/', emergencyAlertController.listEmergencyAlerts);
router.get('/:alertId', emergencyAlertController.getEmergencyAlert);

export default router;
