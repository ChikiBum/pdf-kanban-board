import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      return;
    }
    throw error;
  }
}

export function generateUniqueFileName(originalName: string): string {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
}

export function validateFile(
  file: Express.Multer.File,
  options: {
    allowedMimeTypes: string[];
    maxFileSize: number;
  },
): void {
  if (!options.allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type: ${file.mimetype}`);
  }

  if (file.size > options.maxFileSize) {
    throw new Error(`File size exceeds the maximum allowed (${options.maxFileSize} bytes)`);
  }
}
