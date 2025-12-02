import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, type AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import prisma from '../services/prisma.js';

const router = Router();

// Ensure uploads directories exist
const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');
const coversDir = path.join(process.cwd(), 'uploads', 'covers');

[uploadsDir, avatarsDir, coversDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate unique filename: timestamp-randomstring.extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter for allowed image types
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Extend Request type to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Upload single image endpoint
router.post(
  '/image',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req: MulterRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: {
          message: 'No image file provided',
          code: 'NO_FILE',
        },
      });
      return;
    }

    // Construct the URL for the uploaded image
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const imageUrl = `${baseUrl}/uploads/images/${req.file.filename}`;

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  })
);

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, avatarsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for avatars
});

// Configure multer for cover photo uploads
const coverStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, coversDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `cover-${uniqueSuffix}${ext}`);
  },
});

const coverUpload = multer({
  storage: coverStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for covers
});

// Extended MulterRequest with userId
interface AuthMulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}

// Upload avatar endpoint
router.post(
  '/avatar',
  authenticate,
  avatarUpload.single('avatar'),
  asyncHandler(async (req: AuthMulterRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: { message: 'No avatar file provided', code: 'NO_FILE' },
      });
      return;
    }

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: req.userId },
      data: { avatar: avatarUrl },
    });

    res.status(201).json({
      message: 'Avatar uploaded successfully',
      url: avatarUrl,
      filename: req.file.filename,
    });
  })
);

// Upload cover photo endpoint
router.post(
  '/cover',
  authenticate,
  coverUpload.single('cover'),
  asyncHandler(async (req: AuthMulterRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: { message: 'No cover photo file provided', code: 'NO_FILE' },
      });
      return;
    }

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const coverUrl = `${baseUrl}/uploads/covers/${req.file.filename}`;

    // Update user's cover photo in database
    await prisma.user.update({
      where: { id: req.userId },
      data: { coverPhoto: coverUrl },
    });

    res.status(201).json({
      message: 'Cover photo uploaded successfully',
      url: coverUrl,
      filename: req.file.filename,
    });
  })
);

// Error handling middleware for multer errors
interface MulterError extends Error {
  code?: string;
}

router.use((err: MulterError, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: {
          message: 'File too large. Maximum size is 10MB.',
          code: 'FILE_TOO_LARGE',
        },
      });
      return;
    }
    res.status(400).json({
      error: {
        message: err.message,
        code: 'UPLOAD_ERROR',
      },
    });
    return;
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    res.status(400).json({
      error: {
        message: err.message,
        code: 'INVALID_FILE_TYPE',
      },
    });
    return;
  }
  
  next(err);
});

export default router;
