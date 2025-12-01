import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as userController from '../controllers/userController.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile validation
const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('avatar').optional(),
];

// Change password validation
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// Routes - wrapped with asyncHandler
router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', validate(updateProfileValidation), asyncHandler(userController.updateProfile));
router.put(
  '/change-password',
  validate(changePasswordValidation),
  asyncHandler(userController.changePassword)
);
router.get('/connections', asyncHandler(userController.getConnections));
router.post('/connect/:userId', asyncHandler(userController.connect));
router.delete('/disconnect/:userId', asyncHandler(userController.disconnect));
router.get('/suggested-connections', asyncHandler(userController.getSuggestedConnections));

export default router;
