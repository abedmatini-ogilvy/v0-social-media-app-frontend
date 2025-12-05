import { type Response, type Request } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to extract @mentions from text and create notifications
async function processMentions(
  content: string,
  authorId: string,
  authorName: string,
  postId: string,
  type: 'post' | 'comment'
): Promise<void> {
  // Extract all @mentions from content
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = content.match(mentionRegex);
  
  if (!matches || matches.length === 0) return;

  // Get unique handles (remove @ prefix)
  const handles = [...new Set(matches.map(m => m.substring(1).toLowerCase()))];
  
  // Find users with these handles
  const mentionedUsers = await prisma.user.findMany({
    where: {
      handle: {
        in: handles,
        mode: 'insensitive',
      },
      // Don't notify the author if they mention themselves
      NOT: { id: authorId },
    },
    select: { id: true, handle: true },
  });

  // Create notifications for each mentioned user
  if (mentionedUsers.length > 0) {
    const notifications = mentionedUsers.map(user => ({
      type: 'message' as const,
      title: 'You were mentioned',
      content: type === 'post' 
        ? `${authorName} mentioned you in a post`
        : `${authorName} mentioned you in a comment`,
      userId: user.id,
      actionUrl: `/?post=${postId}`,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  }
}

// Helper to format post response
const formatPostResponse = (
  post: {
    id: string;
    content: string;
    image: string | null;
    location: string | null;
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
    _count?: { postLikes: number };
    postLikes?: { userId: string }[];
  },
  currentUserId?: string
) => ({
  id: post.id,
  content: post.content,
  image: post.image,
  location: post.location,
  likes: post._count?.postLikes ?? 0,
  comments: post.comments,
  shares: post.shares,
  isLikedByCurrentUser: currentUserId 
    ? post.postLikes?.some(like => like.userId === currentUserId) ?? false 
    : false,
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
    const currentUserId = req.userId;

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
        // Include likes by current user to check isLikedByCurrentUser
        postLikes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
        _count: {
          select: { postLikes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.post.count();

    res.json({
      posts: posts.map(post => formatPostResponse(post, currentUserId)),
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

// Public feed - no authentication required
export const getPublicFeed = async (req: Request, res: Response): Promise<void> => {
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
        _count: {
          select: { postLikes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.post.count();

    res.json({
      posts: posts.map(post => formatPostResponse(post)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new AppError('Failed to get public feed', 500, 'INTERNAL_ERROR');
  }
};

// Get current user's posts
export const getMyPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.userId;
    
    const posts = await prisma.post.findMany({
      where: { authorId: req.userId },
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
        postLikes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
        _count: {
          select: { postLikes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts.map(post => formatPostResponse(post, currentUserId)));
  } catch (error) {
    throw new AppError('Failed to get user posts', 500, 'INTERNAL_ERROR');
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
            handle: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: { postLikes: true },
        },
      },
    });

    // Process @mentions in the post content
    const authorName = post.author.handle 
      ? `@${post.author.handle}` 
      : post.author.name;
    await processMentions(content, req.userId!, authorName, post.id, 'post');

    res.status(201).json(formatPostResponse(post, req.userId));
  } catch (error) {
    console.error('Create post error:', error);
    throw new AppError('Failed to create post', 500, 'INTERNAL_ERROR');
  }
};

export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId;

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
        postLikes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
        _count: {
          select: { postLikes: true },
        },
      },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    res.json(formatPostResponse(post, currentUserId));
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
    const currentUserId = req.userId;

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
        postLikes: currentUserId ? {
          where: { userId: currentUserId },
          select: { userId: true },
        } : false,
        _count: {
          select: { postLikes: true },
        },
      },
    });

    res.json(formatPostResponse(post, currentUserId));
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
    const userId = req.userId!;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      throw new AppError('You have already liked this post', 400, 'ALREADY_LIKED');
    }

    // Create the like
    await prisma.postLike.create({
      data: { userId, postId },
    });

    // Fetch the updated post with like count
    const updatedPost = await prisma.post.findUnique({
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
        postLikes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { postLikes: true },
        },
      },
    });

    res.json(formatPostResponse(updatedPost!, userId));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to like post', 500, 'INTERNAL_ERROR');
  }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    // Check if user has liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (!existingLike) {
      throw new AppError('You have not liked this post', 400, 'NOT_LIKED');
    }

    // Delete the like
    await prisma.postLike.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    // Fetch the updated post with like count
    const updatedPost = await prisma.post.findUnique({
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
        postLikes: {
          where: { userId },
          select: { userId: true },
        },
        _count: {
          select: { postLikes: true },
        },
      },
    });

    res.json(formatPostResponse(updatedPost!, userId));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to unlike post', 500, 'INTERNAL_ERROR');
  }
};

// Get list of users who liked a post
export const getPostLikers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'NOT_FOUND');
    }

    // Get likers with pagination
    const [likers, total] = await Promise.all([
      prisma.postLike.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              handle: true,
              avatar: true,
              role: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.postLike.count({ where: { postId } }),
    ]);

    res.json({
      likers: likers.map(like => ({
        ...like.user,
        likedAt: like.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get post likers', 500, 'INTERNAL_ERROR');
  }
};

// Helper to format a comment with author
const formatCommentResponse = (comment: {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  replyCount: number;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    handle: string | null;
    avatar: string | null;
    role: string;
    isVerified: boolean;
    createdAt: Date;
  };
  replies?: Array<{
    id: string;
    content: string;
    postId: string;
    parentId: string | null;
    replyCount: number;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      email: string;
      handle: string | null;
      avatar: string | null;
      role: string;
      isVerified: boolean;
      createdAt: Date;
    };
    replies?: Array<unknown>;
  }>;
}) => ({
  id: comment.id,
  content: comment.content,
  postId: comment.postId,
  parentId: comment.parentId,
  replyCount: comment.replyCount,
  createdAt: comment.createdAt.toISOString(),
  author: {
    id: comment.author.id,
    name: comment.author.name,
    email: comment.author.email,
    handle: comment.author.handle,
    avatar: comment.author.avatar,
    role: comment.author.role,
    isVerified: comment.author.isVerified,
    createdAt: comment.author.createdAt.toISOString(),
  },
  replies: comment.replies?.map((reply) => formatCommentResponse(reply as typeof comment)) || [],
});

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    // Fetch top-level comments (parentId is null) with up to 2 levels of replies
    const comments = await prisma.comment.findMany({
      where: { 
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            handle: true,
            avatar: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        },
        // Level 1 replies
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                handle: true,
                avatar: true,
                role: true,
                isVerified: true,
                createdAt: true,
              },
            },
            // Level 2 replies (max depth)
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    handle: true,
                    avatar: true,
                    role: true,
                    isVerified: true,
                    createdAt: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments.map(formatCommentResponse));
  } catch (error) {
    throw new AppError('Failed to get comments', 500, 'INTERNAL_ERROR');
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;

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

    // If this is a reply, validate parent comment and depth
    let actualParentId = parentId;
    let parentCommentAuthorId: string | null = null;
    
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        include: {
          parent: true, // Get parent's parent to check depth
          author: {
            select: { id: true, name: true },
          },
        },
      });

      if (!parentComment) {
        throw new AppError('Parent comment not found', 404, 'NOT_FOUND');
      }

      if (parentComment.postId !== postId) {
        throw new AppError('Parent comment does not belong to this post', 400, 'VALIDATION_ERROR');
      }

      // Store parent comment author for notification
      parentCommentAuthorId = parentComment.authorId;

      // Check depth - max 2 levels (comment -> reply -> reply to reply)
      // If parent already has a parent (is a reply), and that parent also has a parent (is level 2),
      // then we can't go deeper - attach to the level 2 parent instead
      if (parentComment.parent?.parentId) {
        // Parent is already at level 2, attach reply to level 2 parent
        actualParentId = parentComment.parentId;
        // Update the author to notify (the level 2 parent author)
        const level2Parent = await prisma.comment.findUnique({
          where: { id: actualParentId },
          select: { authorId: true },
        });
        if (level2Parent) {
          parentCommentAuthorId = level2Parent.authorId;
        }
      }
    }

    // Get the current user's name for notification
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true, handle: true },
    });

    // Create comment/reply
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.userId!,
        parentId: actualParentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            handle: true,
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

    // If this is a reply, update parent's reply count and send notification
    if (actualParentId) {
      await prisma.comment.update({
        where: { id: actualParentId },
        data: { replyCount: { increment: 1 } },
      });

      // Create notification for parent comment author (if not replying to own comment)
      if (parentCommentAuthorId && parentCommentAuthorId !== req.userId) {
        const commenterName = currentUser?.handle 
          ? `@${currentUser.handle}` 
          : currentUser?.name || 'Someone';
        
        await prisma.notification.create({
          data: {
            type: 'message', // Using 'message' type for replies
            title: 'New Reply',
            content: `${commenterName} replied to your comment`,
            userId: parentCommentAuthorId,
            actionUrl: `/?post=${postId}`, // Link to the post
          },
        });
      }
    } else {
      // This is a top-level comment - notify the post author (if not commenting on own post)
      if (post.authorId !== req.userId) {
        const commenterName = currentUser?.handle 
          ? `@${currentUser.handle}` 
          : currentUser?.name || 'Someone';
        
        await prisma.notification.create({
          data: {
            type: 'message',
            title: 'New Comment',
            content: `${commenterName} commented on your post`,
            userId: post.authorId,
            actionUrl: `/?post=${postId}`,
          },
        });
      }
    }

    // Process @mentions in the comment content
    const authorName = currentUser?.handle 
      ? `@${currentUser.handle}` 
      : currentUser?.name || 'Someone';
    await processMentions(content, req.userId!, authorName, postId, 'comment');

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      parentId: comment.parentId,
      replyCount: comment.replyCount,
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        name: comment.author.name,
        email: comment.author.email,
        handle: comment.author.handle,
        avatar: comment.author.avatar,
        role: comment.author.role,
        isVerified: comment.author.isVerified,
        createdAt: comment.author.createdAt.toISOString(),
      },
      replies: [],
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to add comment', 500, 'INTERNAL_ERROR');
  }
};
