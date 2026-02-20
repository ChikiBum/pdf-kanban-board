export interface StorageConfig {
  uploadDir: string;
  tempDir: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  baseUrl: string;
}

export interface UploadedFile {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

export interface FileUploadOptions {
  directory?: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
}
