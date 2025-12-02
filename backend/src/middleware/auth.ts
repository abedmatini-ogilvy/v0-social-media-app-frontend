import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Get JWT secret with production validation
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return secret || 'dev-secret-change-in-production';
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        error: {
          message: 'No token provided',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: {
          message: 'No token provided',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: {
          message: 'Token expired',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    res.status(500).json({
      error: {
        message: 'Authentication failed',
        code: 'INTERNAL_ERROR',
      },
    });
  }
};

// Optional authentication - sets userId if token is valid, but doesn't require it
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const secret = getJwtSecret();
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.userId = decoded.userId;
      }
    }

    next();
  } catch {
    // Ignore token errors for optional auth
    next();
  }
};

// Admin authentication middleware - requires user to be an admin
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First, ensure user is authenticated
    if (!req.userId) {
      res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    // Check if user exists and is an admin
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true, isBanned: true },
    });

    if (!user) {
      res.status(401).json({
        error: {
          message: 'User not found',
          code: 'UNAUTHORIZED',
        },
      });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({
        error: {
          message: 'Your account has been banned',
          code: 'FORBIDDEN',
        },
      });
      return;
    }

    if (user.role !== 'admin') {
      res.status(403).json({
        error: {
          message: 'Admin access required',
          code: 'FORBIDDEN',
        },
      });
      return;
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Authorization check failed',
        code: 'INTERNAL_ERROR',
      },
    });
  }
};

// Check if user is banned middleware
export const checkBanned = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { isBanned: true, banReason: true, suspendedUntil: true },
    });

    if (!user) {
      next();
      return;
    }

    // Check if user is banned
    if (user.isBanned) {
      res.status(403).json({
        error: {
          message: user.banReason || 'Your account has been banned',
          code: 'ACCOUNT_BANNED',
        },
      });
      return;
    }

    // Check if user is suspended
    if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
      res.status(403).json({
        error: {
          message: `Your account is suspended until ${user.suspendedUntil.toISOString()}`,
          code: 'ACCOUNT_SUSPENDED',
        },
      });
      return;
    }

    next();
  } catch (error) {
    // Don't block the request if check fails
    next();
  }
};
