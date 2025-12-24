import path from 'node:path';
import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { ensureDirectoryExists, storageConfig } from '../modules/storage';

// Create temp directory if it doesn't exist
ensureDirectoryExists(storageConfig.tempDir).catch(console.error);

// Configure disk storage
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, storageConfig.tempDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File type validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = storageConfig.allowedMimeTypes;
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) ||
    (fileExt === '.pdf' && file.mimetype === 'application/octet-stream')
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
  }
};

// Create multer instance
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: storageConfig.maxFileSize, // Max file size
    files: 1, // Max number of files
  },
  fileFilter,
});

// Error handling middleware
export const handleFileUploadErrors = (
  err: any,
  req: Request,
  res: any,
  next: (err?: any) => void,
) => {
  if (err instanceof multer.MulterError) {
    // Multer errors (e.g., file too large, too many files)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `File too large. Maximum size is ${storageConfig.maxFileSize / (1024 * 1024)}MB`,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Maximum 1 file allowed',
      });
    }
  } else if (err) {
    // Other errors (e.g., invalid file type)
    return res.status(400).json({
      error: err.message || 'File upload failed',
    });
  }
  next();
};
