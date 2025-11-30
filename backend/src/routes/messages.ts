import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import * as messageController from '../controllers/messageController.js';

const router = Router();

// All message routes require authentication
router.use(authenticate);

// Send message validation
const sendMessageValidation = [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required'),
];

// Routes
router.get('/conversations', messageController.getConversations);
router.get('/conversations/:conversationId', messageController.getConversation);
router.post('/', validate(sendMessageValidation), messageController.sendMessage);

export default router;
