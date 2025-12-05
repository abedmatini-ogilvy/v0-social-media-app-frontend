import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as postController from '../controllers/postController.js';

const router = Router();

// Public route - no authentication required
router.get('/public', asyncHandler(postController.getPublicFeed));

// All other post routes require authentication
router.use(authenticate);

// Create post validation
const createPostValidation = [
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('image').optional(),
  body('location').optional().trim(),
];

// Update post validation
const updatePostValidation = [
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('image').optional(),
  body('location').optional().trim(),
];

// Comment validation
const commentValidation = [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('parentId').optional().isString().withMessage('Parent ID must be a string'),
];

// Routes - wrapped with asyncHandler
router.get('/feed', asyncHandler(postController.getFeed));
router.get('/my-posts', asyncHandler(postController.getMyPosts));
router.post('/', validate(createPostValidation), asyncHandler(postController.createPost));
router.get('/:postId', asyncHandler(postController.getPost));
router.put('/:postId', validate(updatePostValidation), asyncHandler(postController.updatePost));
router.delete('/:postId', asyncHandler(postController.deletePost));
router.post('/:postId/like', asyncHandler(postController.likePost));
router.delete('/:postId/unlike', asyncHandler(postController.unlikePost));
router.get('/:postId/likers', asyncHandler(postController.getPostLikers));
router.get('/:postId/comments', asyncHandler(postController.getComments));
router.post('/:postId/comments', validate(commentValidation), asyncHandler(postController.addComment));

export default router;
