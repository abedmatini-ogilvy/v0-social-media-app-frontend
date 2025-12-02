import { Response } from 'express';
import { PrismaClient, ReportReason } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

// Create a report (for users to report content)
export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId, commentId, reason, description } = req.body;

    if (!postId && !commentId) {
      throw new AppError('Either postId or commentId is required', 400, 'VALIDATION_ERROR');
    }

    if (postId && commentId) {
      throw new AppError('Cannot report both post and comment at once', 400, 'VALIDATION_ERROR');
    }

    if (!reason || !['misinformation', 'harassment', 'spam', 'scam', 'inappropriate', 'other'].includes(reason)) {
      throw new AppError('Valid reason is required', 400, 'VALIDATION_ERROR');
    }

    // Check if content exists
    if (postId) {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new AppError('Post not found', 404, 'NOT_FOUND');
      }
      // Can't report own content
      if (post.authorId === req.userId) {
        throw new AppError('Cannot report your own content', 400, 'VALIDATION_ERROR');
      }
    }

    if (commentId) {
      const comment = await prisma.comment.findUnique({ where: { id: commentId } });
      if (!comment) {
        throw new AppError('Comment not found', 404, 'NOT_FOUND');
      }
      // Can't report own content
      if (comment.authorId === req.userId) {
        throw new AppError('Cannot report your own content', 400, 'VALIDATION_ERROR');
      }
    }

    // Check if user already reported this content
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: req.userId,
        ...(postId ? { postId } : { commentId }),
      },
    });

    if (existingReport) {
      throw new AppError('You have already reported this content', 400, 'VALIDATION_ERROR');
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        postId: postId || null,
        commentId: commentId || null,
        reporterId: req.userId!,
        reason: reason as ReportReason,
        description: description || null,
      },
      include: {
        post: {
          select: { id: true, content: true },
        },
        comment: {
          select: { id: true, content: true },
        },
      },
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report: {
        id: report.id,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create report', 500, 'INTERNAL_ERROR');
  }
};

// Get user's submitted reports
export const getMyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      where: { reporterId: req.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        description: true,
        status: true,
        createdAt: true,
        post: {
          select: { id: true, content: true },
        },
        comment: {
          select: { id: true, content: true },
        },
      },
    });

    res.json(reports);
  } catch (error) {
    throw new AppError('Failed to fetch reports', 500, 'INTERNAL_ERROR');
  }
};

// Get published announcements (public endpoint)
export const getPublishedAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { audience } = req.query;

    const where: any = {
      status: 'published',
    };

    // Filter by audience/location if provided
    if (audience) {
      where.OR = [
        { audience: 'all' },
        { audience: { contains: audience as string, mode: 'insensitive' } },
      ];
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { publishedAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        content: true,
        department: true,
        priority: true,
        audience: true,
        publishedAt: true,
        creator: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.json(announcements);
  } catch (error) {
    throw new AppError('Failed to fetch announcements', 500, 'INTERNAL_ERROR');
  }
};
