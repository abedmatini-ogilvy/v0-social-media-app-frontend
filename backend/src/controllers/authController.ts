import { type Request, type Response } from 'express';
import prisma from '../services/prisma.js';
import {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
} from '../services/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { type AuthRequest } from '../middleware/auth.js';

// Helper to format user response (exclude password)
const formatUserResponse = (user: {
  id: string;
  name: string;
  email: string;
  handle: string | null;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  handle: user.handle,
  avatar: user.avatar,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt.toISOString(),
});

// Helper to generate a unique handle from name
const generateHandle = (name: string): string => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 20); // Limit length
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}_${randomSuffix}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, handle } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'CONFLICT');
    }

    // Check if handle is taken (if provided)
    if (handle) {
      const existingHandle = await prisma.user.findUnique({
        where: { handle },
      });
      if (existingHandle) {
        throw new AppError('This handle is already taken', 409, 'CONFLICT');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate handle if not provided
    let userHandle = handle || generateHandle(name);
    
    // Ensure handle is unique (retry with different random suffix if needed)
    let attempts = 0;
    while (attempts < 5) {
      const existingHandle = await prisma.user.findUnique({
        where: { handle: userHandle },
      });
      if (!existingHandle) break;
      userHandle = generateHandle(name);
      attempts++;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        handle: userHandle,
        password: hashedPassword,
        role: role || 'citizen',
      },
    });

    // Generate tokens
    const tokens = generateTokens(user.id);

    res.status(201).json({
      ...tokens,
      user: formatUserResponse(user),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Registration failed', 500, 'INTERNAL_ERROR');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    res.json({
      ...tokens,
      user: formatUserResponse(user),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Login failed', 500, 'INTERNAL_ERROR');
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  // For MVP, we use stateless JWT, so logout is just a client-side operation
  // In production, you might want to blacklist the token or use refresh token rotation
  res.json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400, 'VALIDATION_ERROR');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    res.json({
      ...tokens,
      user: formatUserResponse(user),
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Token refresh failed', 401, 'UNAUTHORIZED');
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Check if user exists (result intentionally unused for security - prevent email enumeration)
    await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // In production, send password reset email here
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    throw new AppError('Password reset request failed', 500, 'INTERNAL_ERROR');
  }
};

export const resetPassword = async (_req: Request, res: Response): Promise<void> => {
  try {
    // In MVP, we don't implement full password reset flow
    // In production, verify reset token and update password
    res.json({ message: 'Password reset functionality is not implemented in MVP' });
  } catch (error) {
    throw new AppError('Password reset failed', 500, 'INTERNAL_ERROR');
  }
};

export const verifyEmail = async (_req: Request, res: Response): Promise<void> => {
  try {
    // In MVP, we don't implement full email verification
    // In production, verify token and update user's isVerified field
    res.json({ message: 'Email verification functionality is not implemented in MVP' });
  } catch (error) {
    throw new AppError('Email verification failed', 500, 'INTERNAL_ERROR');
  }
};
