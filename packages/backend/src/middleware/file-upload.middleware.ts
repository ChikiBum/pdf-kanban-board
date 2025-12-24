import path from 'node:path';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import multer, { type FileFilterCallback } from 'multer';
import { ensureDirectoryExists, storageConfig } from '../modules/storage';

ensureDirectoryExists(storageConfig.tempDir).catch(console.error);

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, storageConfig.tempDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: storageConfig.maxFileSize,
    files: 1,
  },
  fileFilter,
});

export const handleFileUploadErrors = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err && err instanceof Error) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(500).json({
          error: `File too large. Maximum size is ${storageConfig.maxFileSize / (1024 * 1024)}MB`,
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          error: 'Too many files. Maximum 1 file allowed',
        });
      }
    } else if (err) {
      return res.status(500).json({
        error: err.message || 'File upload failed',
      });
    }
  }
  next();
};
