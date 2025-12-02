import { Response } from 'express';
import { PrismaClient, ReportStatus, ReportAction, AnnouncementStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with pagination and search
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const role = req.query.role as string;
    const status = req.query.status as string; // active, banned, suspended

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by role
    if (role && ['citizen', 'official', 'admin'].includes(role)) {
      where.role = role;
    }

    // Filter by status
    if (status === 'banned') {
      where.isBanned = true;
    } else if (status === 'suspended') {
      where.suspendedUntil = { gt: new Date() };
    } else if (status === 'active') {
      where.isBanned = false;
      where.OR = [
        { suspendedUntil: null },
        { suspendedUntil: { lte: new Date() } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          isVerified: true,
          isBanned: true,
          banReason: true,
          bannedAt: true,
          suspendedUntil: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              reportsMade: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch users', 500, 'INTERNAL_ERROR');
  }
};

// Get single user details
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        coverPhoto: true,
        bio: true,
        location: true,
        occupation: true,
        phone: true,
        website: true,
        role: true,
        isVerified: true,
        isBanned: true,
        banReason: true,
        bannedAt: true,
        bannedBy: true,
        suspendedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            connections: true,
            reportsMade: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Get reports against this user's content
    const reportsAgainst = await prisma.report.count({
      where: {
        OR: [
          { post: { authorId: id } },
          { comment: { authorId: id } },
        ],
      },
    });

    res.json({ ...user, reportsAgainst });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch user', 500, 'INTERNAL_ERROR');
  }
};

// Update user (role, verified status)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, isVerified } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const updateData: any = {};
    if (role && ['citizen', 'official', 'admin'].includes(role)) {
      updateData.role = role;
    }
    if (typeof isVerified === 'boolean') {
      updateData.isVerified = isVerified;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update user', 500, 'INTERNAL_ERROR');
  }
};

// Ban user
export const banUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    if (user.role === 'admin') {
      throw new AppError('Cannot ban an admin user', 400, 'VALIDATION_ERROR');
    }

    await prisma.user.update({
      where: { id },
      data: {
        isBanned: true,
        banReason: reason || 'Violation of community guidelines',
        bannedAt: new Date(),
        bannedBy: req.userId,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'Account Banned',
        content: reason || 'Your account has been banned for violating community guidelines.',
        userId: id,
      },
    });

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to ban user', 500, 'INTERNAL_ERROR');
  }
};

// Unban user
export const unbanUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    await prisma.user.update({
      where: { id },
      data: {
        isBanned: false,
        banReason: null,
        bannedAt: null,
        bannedBy: null,
        suspendedUntil: null,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'Account Restored',
        content: 'Your account has been restored. You can now access all features.',
        userId: id,
      },
    });

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to unban user', 500, 'INTERNAL_ERROR');
  }
};

// Suspend user temporarily
export const suspendUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { days, reason } = req.body;

    if (!days || days < 1) {
      throw new AppError('Suspension days must be at least 1', 400, 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    if (user.role === 'admin') {
      throw new AppError('Cannot suspend an admin user', 400, 'VALIDATION_ERROR');
    }

    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + days);

    await prisma.user.update({
      where: { id },
      data: {
        suspendedUntil,
        banReason: reason || `Suspended for ${days} days`,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'Account Suspended',
        content: `Your account has been suspended until ${suspendedUntil.toLocaleDateString()}. Reason: ${reason || 'Violation of community guidelines'}`,
        userId: id,
      },
    });

    res.json({ message: `User suspended for ${days} days` });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to suspend user', 500, 'INTERNAL_ERROR');
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    if (user.role === 'admin') {
      throw new AppError('Cannot delete an admin user', 400, 'VALIDATION_ERROR');
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete user', 500, 'INTERNAL_ERROR');
  }
};

// Reset user password
export const resetUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400, 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'system',
        title: 'Password Reset',
        content: 'Your password has been reset by an administrator. Please change it immediately after logging in.',
        userId: id,
      },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to reset password', 500, 'INTERNAL_ERROR');
  }
};

// ============================================
// REPORTS MANAGEMENT
// ============================================

// Get all reports
export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as ReportStatus;
    const reason = req.query.reason as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (reason) where.reason = reason;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: { id: true, name: true, avatar: true },
          },
          post: {
            select: {
              id: true,
              content: true,
              author: { select: { id: true, name: true, avatar: true } },
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
              author: { select: { id: true, name: true, avatar: true } },
            },
          },
          reviewer: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch reports', 500, 'INTERNAL_ERROR');
  }
};

// Get single report
export const getReportById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        post: {
          include: {
            author: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        comment: {
          include: {
            author: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
        reviewer: {
          select: { id: true, name: true },
        },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404, 'NOT_FOUND');
    }

    res.json(report);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch report', 500, 'INTERNAL_ERROR');
  }
};

// Review report (update status and action)
export const reviewReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, action } = req.body as { status: ReportStatus; action?: ReportAction };

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        post: { select: { id: true, authorId: true } },
        comment: { select: { id: true, authorId: true } },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404, 'NOT_FOUND');
    }

    // Update the report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        action,
        reviewedBy: req.userId,
        reviewedAt: new Date(),
      },
    });

    // Take action based on the decision
    if (action) {
      const contentAuthorId = report.post?.authorId || report.comment?.authorId;

      switch (action) {
        case 'warning':
          if (contentAuthorId) {
            await prisma.notification.create({
              data: {
                type: 'system',
                title: 'Content Warning',
                content: 'Your content has been flagged for violating community guidelines. Please review our policies.',
                userId: contentAuthorId,
              },
            });
          }
          break;

        case 'post_removed':
          if (report.postId) {
            await prisma.post.delete({ where: { id: report.postId } });
            if (contentAuthorId) {
              await prisma.notification.create({
                data: {
                  type: 'system',
                  title: 'Content Removed',
                  content: 'Your post has been removed for violating community guidelines.',
                  userId: contentAuthorId,
                },
              });
            }
          } else if (report.commentId) {
            await prisma.comment.delete({ where: { id: report.commentId } });
            if (contentAuthorId) {
              await prisma.notification.create({
                data: {
                  type: 'system',
                  title: 'Comment Removed',
                  content: 'Your comment has been removed for violating community guidelines.',
                  userId: contentAuthorId,
                },
              });
            }
          }
          break;

        case 'user_suspended':
          if (contentAuthorId) {
            const suspendedUntil = new Date();
            suspendedUntil.setDate(suspendedUntil.getDate() + 7); // 7 day suspension
            await prisma.user.update({
              where: { id: contentAuthorId },
              data: {
                suspendedUntil,
                banReason: 'Suspended due to reported content',
              },
            });
            await prisma.notification.create({
              data: {
                type: 'system',
                title: 'Account Suspended',
                content: `Your account has been suspended for 7 days due to content violations.`,
                userId: contentAuthorId,
              },
            });
          }
          break;

        case 'user_banned':
          if (contentAuthorId) {
            await prisma.user.update({
              where: { id: contentAuthorId },
              data: {
                isBanned: true,
                banReason: 'Banned due to severe content violations',
                bannedAt: new Date(),
                bannedBy: req.userId,
              },
            });
            await prisma.notification.create({
              data: {
                type: 'system',
                title: 'Account Banned',
                content: 'Your account has been permanently banned for severe violations of community guidelines.',
                userId: contentAuthorId,
              },
            });
          }
          break;
      }
    }

    res.json(updatedReport);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to review report', 500, 'INTERNAL_ERROR');
  }
};

// Delete report
export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new AppError('Report not found', 404, 'NOT_FOUND');
    }

    await prisma.report.delete({ where: { id } });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete report', 500, 'INTERNAL_ERROR');
  }
};

// ============================================
// ANNOUNCEMENTS MANAGEMENT
// ============================================

// Get all announcements
export const getAllAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as AnnouncementStatus;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.announcement.count({ where }),
    ]);

    res.json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch announcements', 500, 'INTERNAL_ERROR');
  }
};

// Create announcement
export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, department, priority, audience, scheduledFor } = req.body;

    if (!title || !content) {
      throw new AppError('Title and content are required', 400, 'VALIDATION_ERROR');
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        department,
        priority: priority || 'medium',
        audience: audience || 'all',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? 'scheduled' : 'draft',
        createdBy: req.userId!,
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create announcement', 500, 'INTERNAL_ERROR');
  }
};

// Update announcement
export const updateAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, department, priority, audience, scheduledFor, status } = req.body;

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      throw new AppError('Announcement not found', 404, 'NOT_FOUND');
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        department,
        priority,
        audience,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status,
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update announcement', 500, 'INTERNAL_ERROR');
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      throw new AppError('Announcement not found', 404, 'NOT_FOUND');
    }

    await prisma.announcement.delete({ where: { id } });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete announcement', 500, 'INTERNAL_ERROR');
  }
};

// Publish announcement
export const publishAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      throw new AppError('Announcement not found', 404, 'NOT_FOUND');
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to publish announcement', 500, 'INTERNAL_ERROR');
  }
};

// ============================================
// ANALYTICS
// ============================================

// Get dashboard overview stats
export const getOverviewStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalPosts,
      pendingReports,
      verifiedOfficials,
      newUsersToday,
      newPostsToday,
      bannedUsers,
      totalAnnouncements,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { isVerified: true, role: 'official' } }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.post.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.announcement.count({ where: { status: 'published' } }),
    ]);

    res.json({
      totalUsers,
      totalPosts,
      pendingReports,
      verifiedOfficials,
      newUsersToday,
      newPostsToday,
      bannedUsers,
      totalAnnouncements,
    });
  } catch (error) {
    throw new AppError('Failed to fetch overview stats', 500, 'INTERNAL_ERROR');
  }
};

// Get user analytics (growth over time)
export const getUserAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user counts by day
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    // Group by date
    const usersByDate: Record<string, number> = {};
    users.forEach((user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      usersByDate[date] = (usersByDate[date] || 0) + 1;
    });

    // Get role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    res.json({
      userGrowth: usersByDate,
      roleDistribution: roleDistribution.map((r) => ({
        role: r.role,
        count: r._count,
      })),
      totalNewUsers: users.length,
    });
  } catch (error) {
    throw new AppError('Failed to fetch user analytics', 500, 'INTERNAL_ERROR');
  }
};

// Get post analytics
export const getPostAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, likes: true, comments: true, shares: true },
    });

    // Group by date
    const postsByDate: Record<string, number> = {};
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    posts.forEach((post) => {
      const date = post.createdAt.toISOString().split('T')[0];
      postsByDate[date] = (postsByDate[date] || 0) + 1;
      totalLikes += post.likes;
      totalComments += post.comments;
      totalShares += post.shares;
    });

    res.json({
      postGrowth: postsByDate,
      totalNewPosts: posts.length,
      engagement: {
        totalLikes,
        totalComments,
        totalShares,
        avgLikesPerPost: posts.length ? (totalLikes / posts.length).toFixed(2) : 0,
        avgCommentsPerPost: posts.length ? (totalComments / posts.length).toFixed(2) : 0,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch post analytics', 500, 'INTERNAL_ERROR');
  }
};

// Get report analytics
export const getReportAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      byStatus,
      byReason,
      byAction,
      recentReports,
    ] = await Promise.all([
      prisma.report.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.report.groupBy({
        by: ['reason'],
        _count: true,
      }),
      prisma.report.groupBy({
        by: ['action'],
        _count: true,
        where: { action: { not: null } },
      }),
      prisma.report.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    res.json({
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
      byReason: byReason.map((r) => ({ reason: r.reason, count: r._count })),
      byAction: byAction.map((a) => ({ action: a.action, count: a._count })),
      reportsLast7Days: recentReports,
    });
  } catch (error) {
    throw new AppError('Failed to fetch report analytics', 500, 'INTERNAL_ERROR');
  }
};
