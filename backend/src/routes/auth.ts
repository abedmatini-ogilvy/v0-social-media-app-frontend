import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, strictLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as authController from '../controllers/authController.js';

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// Register validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['citizen', 'official'])
    .withMessage('Role must be citizen or official'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes - wrapped with asyncHandler to catch errors
router.post('/register', validate(registerValidation), asyncHandler(authController.register));
router.post('/login', validate(loginValidation), asyncHandler(authController.login));
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.post('/refresh-token', asyncHandler(authController.refreshToken));
router.post('/forgot-password', strictLimiter, asyncHandler(authController.forgotPassword));
router.post('/reset-password', strictLimiter, asyncHandler(authController.resetPassword));
router.post('/verify-email', asyncHandler(authController.verifyEmail));

export default router;
