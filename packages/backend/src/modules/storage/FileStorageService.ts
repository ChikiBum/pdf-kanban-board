// File: packages/backend/src/modules/storage/FileStorageService.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { storageConfig } from './storage.config';
import type { FileUploadOptions, StorageConfig, UploadedFile } from './storage.types';
import { ensureDirectoryExists, generateUniqueFileName, validateFile } from './storage.utils';

export async function uploadFile(
  file: Express.Multer.File,
  options: FileUploadOptions & { config?: StorageConfig } = {},
): Promise<UploadedFile> {
  const config = options.config || storageConfig;

  const {
    directory = '',
    allowedMimeTypes = config.allowedMimeTypes,
    maxFileSize = config.maxFileSize,
  } = options;

  // If file.buffer is not available (e.g., using diskStorage), read from file.path
  if (!file.buffer) {
    if (file.path) {
      file.buffer = await fs.readFile(file.path);
    } else {
      throw new Error('No file buffer or path available');
    }
  }

  await ensureDirectoryExists(config.uploadDir);
  await ensureDirectoryExists(config.tempDir);
  validateFile(file, { allowedMimeTypes, maxFileSize });

  const fileName = generateUniqueFileName(file.originalname);
  const relativePath = directory ? path.join(directory, fileName) : fileName;
  const fullPath = path.join(config.uploadDir, relativePath);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, file.buffer);

  return {
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: fullPath,
    url: `/${path.join('uploads', relativePath).replace(/\\/g, '/')}`,
  };
}

// Export as a service object
export const storageService = {
  uploadFile,
};

// For backward compatibility
export default storageService;
