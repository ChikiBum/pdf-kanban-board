import { z } from 'zod';

export const DocumentStatus = z.enum(['received', 'in_review', 'approved', 'signed', 'on_hold']);

export type DocumentStatus = z.infer<typeof DocumentStatus>;

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  status: DocumentStatus,
  orgId: z.string().uuid(),
  userId: z.string().uuid(),
  filePath: z.string().min(1, 'File path is required'),
  signedFilePath: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const CreateDocumentDto = DocumentSchema.pick({
  title: true,
  filePath: true,
  orgId: true,
  userId: true,
});

export type CreateDocumentDto = z.infer<typeof CreateDocumentDto>;

export const UpdateDocumentDto = DocumentSchema.pick({
  title: true,
  status: true,
}).partial();

export type UpdateDocumentDto = z.infer<typeof UpdateDocumentDto>;
