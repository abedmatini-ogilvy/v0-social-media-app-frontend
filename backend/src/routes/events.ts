import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as eventController from '../controllers/eventController.js';

const router = Router();

// Public routes
router.get('/', eventController.listEvents);
router.get('/my-events', authenticate, eventController.getMyEvents);
router.get('/:eventId', eventController.getEvent);
router.post('/:eventId/attend', authenticate, eventController.attendEvent);

export default router;
