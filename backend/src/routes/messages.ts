import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as messageController from '../controllers/messageController.js';

const router = Router();

// All message routes require authentication
router.use(authenticate);

// Send message validation
const sendMessageValidation = [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
];

// Routes - wrapped in asyncHandler to properly catch async errors
router.get('/conversations', asyncHandler(messageController.getConversations));
router.get('/conversations/:conversationId', asyncHandler(messageController.getConversation));
router.post('/', validate(sendMessageValidation), asyncHandler(messageController.sendMessage));

export default router;
