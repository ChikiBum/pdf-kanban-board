import fs from 'node:fs/promises';
import path from 'node:path';
import { storageConfig } from './storage.config';
import type { UploadedFile } from './storage.types';
import { ensureDirectoryExists, generateUniqueFileName } from './storage.utils';

const storeFile = async (
  file: Express.Multer.File,
  options?: { orgId?: string | number },
): Promise<UploadedFile> => {
  if (!file.buffer) {
    if (file.path) {
      file.buffer = await fs.readFile(file.path);
    } else {
      throw new Error('No file buffer or path available');
    }
  }

  const { uploadDir } = storageConfig;
  const orgDir = options?.orgId ? `org_${options.orgId}` : 'shared';

  const fullUploadDir = path.join(uploadDir, orgDir);
  console.log('uploadDir', fullUploadDir);

  await ensureDirectoryExists(fullUploadDir);
  // await ensureDirectoryExists(config.tempDir);

  const fileName = generateUniqueFileName(file.originalname);
  const fullPath = path.join(fullUploadDir, fileName);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, file.buffer);

  return {
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: fullPath,
    url: `/${path.relative(storageConfig.uploadDir, fullPath).replace(/\\/g, '/')}`,
  };
};

export { storeFile };
