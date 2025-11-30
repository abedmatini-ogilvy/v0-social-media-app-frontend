import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
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
