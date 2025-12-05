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
  handle?: string | null;
  avatar: string | null;
  coverPhoto?: string | null;
  bio?: string | null;
  location?: string | null;
  occupation?: string | null;
  phone?: string | null;
  website?: string | null;
  interests?: string[];
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}, connectionsCount?: number) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  handle: user.handle || null,
  avatar: user.avatar,
  coverPhoto: user.coverPhoto || null,
  bio: user.bio || null,
  location: user.location || null,
  occupation: user.occupation || null,
  phone: user.phone || null,
  website: user.website || null,
  interests: user.interests || [],
  address: user.address || null,
  city: user.city || null,
  state: user.state || null,
  pincode: user.pincode || null,
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
    const { name, handle, avatar, coverPhoto, bio, location, occupation, phone, website, interests, address, city, state, pincode } = req.body;

    // If updating handle, check if it's unique
    if (handle) {
      const existingHandle = await prisma.user.findFirst({
        where: { 
          handle,
          NOT: { id: req.userId }
        },
      });
      if (existingHandle) {
        throw new AppError('This handle is already taken', 409, 'CONFLICT');
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(handle !== undefined && { handle }),
        ...(avatar !== undefined && { avatar }),
        ...(coverPhoto !== undefined && { coverPhoto }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(occupation !== undefined && { occupation }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(interests !== undefined && { interests }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(pincode !== undefined && { pincode }),
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
            handle: true,
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

    // Get current user for notification
    const currentUser = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true },
    });

    // Check if already connected (either direction)
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

    // Create BIDIRECTIONAL connections in a transaction
    // When User A connects to User B, both connections are created
    await prisma.$transaction(async (tx) => {
      // Create connection from current user to target user
      await tx.connection.create({
        data: {
          userId: req.userId!,
          connectedId: targetUserId,
        },
      });

      // Check if reverse connection already exists
      const reverseConnection = await tx.connection.findUnique({
        where: {
          userId_connectedId: {
            userId: targetUserId,
            connectedId: req.userId!,
          },
        },
      });

      // Create reverse connection if it doesn't exist (bidirectional)
      if (!reverseConnection) {
        await tx.connection.create({
          data: {
            userId: targetUserId,
            connectedId: req.userId!,
          },
        });
      }
    });

    // Create notification for target user
    await prisma.notification.create({
      data: {
        type: 'connection',
        title: 'New Connection',
        content: `${currentUser?.name || 'Someone'} has connected with you`,
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

    // Delete BOTH connections in a transaction (bidirectional disconnect)
    await prisma.$transaction(async (tx) => {
      // Delete connection from current user to target
      await tx.connection.deleteMany({
        where: {
          userId: req.userId!,
          connectedId: targetUserId,
        },
      });

      // Delete reverse connection from target to current user
      await tx.connection.deleteMany({
        where: {
          userId: targetUserId,
          connectedId: req.userId!,
        },
      });
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
        handle: true,
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

// Get user settings
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.userId },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId: req.userId! },
      });
    }

    res.json(settings);
  } catch (error) {
    throw new AppError('Failed to get settings', 500, 'INTERNAL_ERROR');
  }
};

// Update user settings
export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      emergencyAlerts,
      schemeUpdates,
      communityUpdates,
      profileVisibility,
      postVisibility,
      locationSharing,
      dataAnalytics,
      personalizedAds,
      twoFactorEnabled,
      loginAlerts,
      primaryLanguage,
      secondaryLanguage,
      autoTranslate,
      theme,
      fontSize,
      highContrast,
      largeText,
      screenReader,
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.userId },
      update: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(smsNotifications !== undefined && { smsNotifications }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(emergencyAlerts !== undefined && { emergencyAlerts }),
        ...(schemeUpdates !== undefined && { schemeUpdates }),
        ...(communityUpdates !== undefined && { communityUpdates }),
        ...(profileVisibility !== undefined && { profileVisibility }),
        ...(postVisibility !== undefined && { postVisibility }),
        ...(locationSharing !== undefined && { locationSharing }),
        ...(dataAnalytics !== undefined && { dataAnalytics }),
        ...(personalizedAds !== undefined && { personalizedAds }),
        ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
        ...(loginAlerts !== undefined && { loginAlerts }),
        ...(primaryLanguage !== undefined && { primaryLanguage }),
        ...(secondaryLanguage !== undefined && { secondaryLanguage }),
        ...(autoTranslate !== undefined && { autoTranslate }),
        ...(theme !== undefined && { theme }),
        ...(fontSize !== undefined && { fontSize }),
        ...(highContrast !== undefined && { highContrast }),
        ...(largeText !== undefined && { largeText }),
        ...(screenReader !== undefined && { screenReader }),
      },
      create: {
        userId: req.userId!,
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(smsNotifications !== undefined && { smsNotifications }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(emergencyAlerts !== undefined && { emergencyAlerts }),
        ...(schemeUpdates !== undefined && { schemeUpdates }),
        ...(communityUpdates !== undefined && { communityUpdates }),
        ...(profileVisibility !== undefined && { profileVisibility }),
        ...(postVisibility !== undefined && { postVisibility }),
        ...(locationSharing !== undefined && { locationSharing }),
        ...(dataAnalytics !== undefined && { dataAnalytics }),
        ...(personalizedAds !== undefined && { personalizedAds }),
        ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
        ...(loginAlerts !== undefined && { loginAlerts }),
        ...(primaryLanguage !== undefined && { primaryLanguage }),
        ...(secondaryLanguage !== undefined && { secondaryLanguage }),
        ...(autoTranslate !== undefined && { autoTranslate }),
        ...(theme !== undefined && { theme }),
        ...(fontSize !== undefined && { fontSize }),
        ...(highContrast !== undefined && { highContrast }),
        ...(largeText !== undefined && { largeText }),
        ...(screenReader !== undefined && { screenReader }),
      },
    });

    res.json(settings);
  } catch (error) {
    throw new AppError('Failed to update settings', 500, 'INTERNAL_ERROR');
  }
};

// Search connected users for @mentions autocomplete
export const searchMentions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const query = typeof q === 'string' ? q.trim().toLowerCase() : '';

    if (!query) {
      res.json([]);
      return;
    }

    // Get user's connections first
    const connections = await prisma.connection.findMany({
      where: { userId: req.userId },
      select: { connectedId: true },
    });

    const connectedIds = connections.map((c) => c.connectedId);

    if (connectedIds.length === 0) {
      res.json([]);
      return;
    }

    // Search connected users by handle or name
    const users = await prisma.user.findMany({
      where: {
        id: { in: connectedIds },
        OR: [
          { handle: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        handle: true,
        avatar: true,
        role: true,
        isVerified: true,
      },
      orderBy: [
        // Prioritize exact handle matches
        { handle: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json(users);
  } catch (error) {
    throw new AppError('Failed to search users for mentions', 500, 'INTERNAL_ERROR');
  }
};
