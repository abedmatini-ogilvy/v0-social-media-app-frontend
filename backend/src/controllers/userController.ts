import { type Response } from 'express';
import prisma from '../services/prisma.js';
import { hashPassword, comparePassword } from '../services/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format user response (exclude password)
const formatUserResponse = (user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  coverPhoto?: string | null;
  bio?: string | null;
  location?: string | null;
  occupation?: string | null;
  phone?: string | null;
  website?: string | null;
  interests?: string[];
  role: string;
  isVerified: boolean;
  createdAt: Date;
}, connectionsCount?: number) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  coverPhoto: user.coverPhoto || null,
  bio: user.bio || null,
  location: user.location || null,
  occupation: user.occupation || null,
  phone: user.phone || null,
  website: user.website || null,
  interests: user.interests || [],
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt.toISOString(),
  ...(connectionsCount !== undefined && { connections: connectionsCount }),
});

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Get connections count
    const connectionsCount = await prisma.connection.count({
      where: { userId: req.userId },
    });

    res.json(formatUserResponse(user, connectionsCount));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to get profile', 500, 'INTERNAL_ERROR');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar, coverPhoto, bio, location, occupation, phone, website, interests } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(coverPhoto !== undefined && { coverPhoto }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(occupation !== undefined && { occupation }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(interests !== undefined && { interests }),
      },
    });

    // Get connections count for response
    const connectionsCount = await prisma.connection.count({
      where: { userId: req.userId },
    });

    res.json(formatUserResponse(user, connectionsCount));
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update profile', 500, 'INTERNAL_ERROR');
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400, 'VALIDATION_ERROR');
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to change password', 500, 'INTERNAL_ERROR');
  }
};

export const getConnections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const connections = await prisma.connection.findMany({
      where: { userId: req.userId },
      include: {
        connected: {
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

    res.json(connections.map((c) => formatUserResponse(c.connected)));
  } catch (error) {
    throw new AppError('Failed to get connections', 500, 'INTERNAL_ERROR');
  }
};

export const connect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId: targetUserId } = req.params;

    if (!targetUserId) {
      throw new AppError('User ID is required', 400, 'VALIDATION_ERROR');
    }

    if (req.userId === targetUserId) {
      throw new AppError('Cannot connect with yourself', 400, 'VALIDATION_ERROR');
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Check if already connected
    const existingConnection = await prisma.connection.findUnique({
      where: {
        userId_connectedId: {
          userId: req.userId!,
          connectedId: targetUserId,
        },
      },
    });

    if (existingConnection) {
      throw new AppError('Already connected', 409, 'CONFLICT');
    }

    // Create connection
    await prisma.connection.create({
      data: {
        userId: req.userId!,
        connectedId: targetUserId,
      },
    });

    // Create notification for target user
    await prisma.notification.create({
      data: {
        type: 'connection',
        title: 'New Connection',
        content: `Someone has connected with you`,
        userId: targetUserId,
      },
    });

    res.status(201).json({ message: 'Connected successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to connect', 500, 'INTERNAL_ERROR');
  }
};

export const disconnect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId: targetUserId } = req.params;

    if (!targetUserId) {
      throw new AppError('User ID is required', 400, 'VALIDATION_ERROR');
    }

    await prisma.connection.delete({
      where: {
        userId_connectedId: {
          userId: req.userId!,
          connectedId: targetUserId,
        },
      },
    });

    res.json({ message: 'Disconnected successfully' });
  } catch (error) {
    throw new AppError('Failed to disconnect', 500, 'INTERNAL_ERROR');
  }
};

export const getSuggestedConnections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get user's existing connections
    const existingConnections = await prisma.connection.findMany({
      where: { userId: req.userId },
      select: { connectedId: true },
    });

    const connectedIds = existingConnections.map((c) => c.connectedId);

    // Get suggested users (users not already connected)
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...connectedIds, req.userId!],
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res.json(suggestedUsers.map((u) => formatUserResponse(u)));
  } catch (error) {
    throw new AppError('Failed to get suggested connections', 500, 'INTERNAL_ERROR');
  }
};
