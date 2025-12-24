import type { FileUploadOptions, StorageConfig, UploadedFile } from './storage.types';

export interface IStorageService {
  readonly config: StorageConfig;
  uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<UploadedFile>;
  deleteFile(filePath: string): Promise<void>;
  getFilePath(relativePath: string): string;
  getFileUrl(relativePath: string): string;
  fileExists(relativePath: string): Promise<boolean>;
}
