import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as searchController from '../controllers/searchController.js';

const router = Router();

// Search requires authentication
router.get('/', authenticate, searchController.search);

export default router;
