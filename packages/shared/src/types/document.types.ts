import { z } from 'zod';

export const DocumentStatus = z.enum(['received', 'in_review', 'approved', 'signed', 'on_hold']);

export type DocumentStatus = z.infer<typeof DocumentStatus>;

export const DocumentSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  status: DocumentStatus,
  orgId: z.number().int().positive(),
  filePath: z.string().min(1, 'File path is required'),
  uploadedBy: z.number().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
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
