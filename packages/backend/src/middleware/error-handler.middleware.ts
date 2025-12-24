import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File size exceeds the maximum allowed',
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
}
