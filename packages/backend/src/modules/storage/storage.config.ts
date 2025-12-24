import path from 'node:path';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const maxFileSize = process.env.MAX_FILE_SIZE
  ? Number(process.env.MAX_FILE_SIZE)
  : 10 * 1024 * 1024;

export const storageConfig = {
  uploadDir: path.join(process.cwd(), uploadDir),
  tempDir: path.join(process.cwd(), uploadDir, 'temp'),
  maxFileSize,
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  baseUrl: `/${uploadDir}`,
};
