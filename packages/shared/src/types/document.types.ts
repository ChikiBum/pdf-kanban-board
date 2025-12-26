import { z } from 'zod';

export const DocumentStatus = z.enum(['received', 'in_review', 'approved', 'signed', 'on_hold']);

export type DocumentStatus = z.infer<typeof DocumentStatus>;

const DocumentSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  status: DocumentStatus,
  orgId: z.number().int().positive(),
  filePath: z.string().min(1, 'File path is required'),
  uploadedBy: z.number().nullable(),
  originalName: z.string().min(1, 'Original name is required'),
  contentHash: z.string().min(1, 'Content hash is required'),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  isDuplicate: z.boolean().optional(),
  message: z.string().optional(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const DocumentVersionSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.number().int().positive(),
  versionNumber: z.number().int().positive(),
  filePath: z.string(),
  createdAt: z.date().nullable(),
});

export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;

export const CreateDocumentDto = DocumentSchema.pick({
  orgId: true,
  title: true,
  filePath: true,
  uploadedBy: true,
  originalName: true,
  contentHash: true,
  isDuplicate: true,
  message: true,
});

export type CreateDocumentDto = z.infer<typeof CreateDocumentDto>;

export const CreateDocumentVersionDto = DocumentVersionSchema.pick({
  documentId: true,
  versionNumber: true,
  filePath: true,
});

export type CreateDocumentVersionDto = z.infer<typeof CreateDocumentVersionDto>;

export const UpdateDocumentDto = DocumentSchema.pick({
  title: true,
  status: true,
}).partial();

export type UpdateDocumentDto = z.infer<typeof UpdateDocumentDto>;
