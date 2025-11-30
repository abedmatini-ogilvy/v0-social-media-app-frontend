import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import * as postController from '../controllers/postController.js';

const router = Router();

// All post routes require authentication
router.use(authenticate);

// Create post validation
const createPostValidation = [
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('image').optional(),
];

// Update post validation
const updatePostValidation = [
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('image').optional(),
];

// Comment validation
const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
];

// Routes
router.get('/feed', postController.getFeed);
router.post('/', validate(createPostValidation), postController.createPost);
router.get('/:postId', postController.getPost);
router.put('/:postId', validate(updatePostValidation), postController.updatePost);
router.delete('/:postId', postController.deletePost);
router.post('/:postId/like', postController.likePost);
router.delete('/:postId/unlike', postController.unlikePost);
router.get('/:postId/comments', postController.getComments);
router.post('/:postId/comments', validate(commentValidation), postController.addComment);

export default router;
