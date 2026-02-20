import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { storageConfig } from '../modules/storage';

const multerInstance = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
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
  },
  limits: {
    fileSize: storageConfig.maxFileSize,
    files: 1,
  },
});

const uploadMiddleware = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const upload = multerInstance.single(fieldName);
      upload(req, res, (err: unknown) => {
        if (err) {
          return next(err);
        }
        next();
      });
    };
  },
};

export { uploadMiddleware };
