import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
