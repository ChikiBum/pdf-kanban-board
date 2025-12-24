// packages/shared/src/types/storage.types.ts
import { z } from 'zod';

export const FileUploadOptionsSchema = z.object({
  directory: z.string().optional(),
  allowedMimeTypes: z.array(z.string()).optional(),
  maxFileSize: z.number().optional(),
});

export type FileUploadOptions = z.infer<typeof FileUploadOptionsSchema>;

export interface UploadedFile {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

export interface StorageConfig {
  uploadDir: string;
  tempDir: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  baseUrl: string;
}
