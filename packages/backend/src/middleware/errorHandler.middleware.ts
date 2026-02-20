import type { NextFunction, Request, Response } from 'express-serve-static-core';
import multer from 'multer';
import { storageConfig } from '../modules/storage/storage.config';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error handler caught:', {
    message: err instanceof Error ? err.message : String(err),
    name: err instanceof Error ? err.name : 'UnknownError',
    stack: err instanceof Error ? err.stack : undefined,
    code: err && typeof err === 'object' && 'code' in err ? err.code : undefined,
  });

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File size exceeds the maximum allowed',
        details: `Maximum file size is ${storageConfig.maxFileSize / 1024 / 1024}MB`,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Too many files or invalid field name',
      });
    }
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
};

export default errorHandler;
