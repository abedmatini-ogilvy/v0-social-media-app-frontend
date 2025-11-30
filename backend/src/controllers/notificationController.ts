import { type Response } from 'express';
import prisma from '../services/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format notification response
const formatNotificationResponse = (notification: {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: Date;
}) => ({
  id: notification.id,
  type: notification.type,
  title: notification.title,
  content: notification.content,
  isRead: notification.isRead,
  actionUrl: notification.actionUrl,
  createdAt: notification.createdAt.toISOString(),
});

export const listNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notifications.map(formatNotificationResponse));
  } catch (error) {
    throw new AppError('Failed to get notifications', 500, 'INTERNAL_ERROR');
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404, 'NOT_FOUND');
    }

    if (notification.userId !== req.userId) {
      throw new AppError('Not authorized', 403, 'FORBIDDEN');
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json(formatNotificationResponse(updatedNotification));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to mark notification as read', 500, 'INTERNAL_ERROR');
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    throw new AppError('Failed to mark all notifications as read', 500, 'INTERNAL_ERROR');
  }
};
