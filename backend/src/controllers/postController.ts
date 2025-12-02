import { type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format post response
const formatPostResponse = (post: {
  id: string;
  content: string;
  image: string | null;
  location: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    isVerified: boolean;
    createdAt: Date;
  };
}) => ({
  id: post.id,
  content: post.content,
  image: post.image,
  location: post.location,
  likes: post.likes,
  comments: post.comments,
  shares: post.shares,
  createdAt: post.createdAt.toISOString(),
  author: {
    id: post.author.id,
    name: post.author.name,
    email: post.author.email,
    avatar: post.author.avatar,
    role: post.author.role,
    isVerified: post.author.isVerified,
    createdAt: post.author.createdAt.toISOString(),
  },
});

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.post.count();

    res.json({
      posts: posts.map(formatPostResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new AppError('Failed to get feed', 500, 'INTERNAL_ERROR');
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, image, location } = req.body;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        location,
        authorId: req.userId!,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    res.status(201).json(formatPostResponse(post));
  } catch (error) {
    throw new AppError('Failed to create post', 500, 'INTERNAL_ERROR');
  }
};

export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    res.json(formatPostResponse(post));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get post', 500, 'INTERNAL_ERROR');
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, image } = req.body;

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    if (existingPost.authorId !== req.userId) {
      throw new AppError('Not authorized to update this post', 403, 'FORBIDDEN');
    }

    const { location } = req.body;
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content && { content }),
        ...(image !== undefined && { image }),
        ...(location !== undefined && { location }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(formatPostResponse(post));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update post', 500, 'INTERNAL_ERROR');
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    if (existingPost.authorId !== req.userId) {
      throw new AppError('Not authorized to delete this post', 403, 'FORBIDDEN');
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete post', 500, 'INTERNAL_ERROR');
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // For MVP, we use simple counter increment
    // In production, you'd track individual likes in a separate table
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(formatPostResponse(post));
  } catch (error) {
    throw new AppError('Failed to like post', 500, 'INTERNAL_ERROR');
  }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // First get current post to check likes count
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!currentPost) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    // Only decrement if likes > 0 to prevent negative values
    const newLikes = Math.max(0, currentPost.likes - 1);
    
    const post = await prisma.post.update({
      where: { id: postId },
      data: { likes: newLikes },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(formatPostResponse(post));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to unlike post', 500, 'INTERNAL_ERROR');
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        author: {
          id: comment.author.id,
          name: comment.author.name,
          email: comment.author.email,
          avatar: comment.author.avatar,
          role: comment.author.role,
          isVerified: comment.author.isVerified,
          createdAt: comment.author.createdAt.toISOString(),
        },
      }))
    );
  } catch (error) {
    throw new AppError('Failed to get comments', 500, 'INTERNAL_ERROR');
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!postId) {
      throw new AppError('Post ID is required', 400, 'VALIDATION_ERROR');
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.userId!,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: { comments: { increment: 1 } },
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        name: comment.author.name,
        email: comment.author.email,
        avatar: comment.author.avatar,
        role: comment.author.role,
        isVerified: comment.author.isVerified,
        createdAt: comment.author.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to add comment', 500, 'INTERNAL_ERROR');
  }
};
