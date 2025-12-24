import type { RequestHandler } from 'express';
import { z } from 'zod';
import { storageService } from '../storage';
import { documentService } from './document.service';

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  orgId: z.string().min(1, 'Organization ID is required'),
});

export const uploadDocument: RequestHandler = async (req, res, next) => {
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Validate request body
    const { title, description, orgId } = uploadSchema.parse(req.body);
    // Upload file to storage

    const fileInfo = await storageService.uploadFile(req.file, {
      directory: `org_${orgId}/documents`,
    });
    // Save document info to database
    const document = await documentService.createDocument({
      orgId,
      title,
      filePath: fileInfo.path,
      uploadedBy: req.tenantContext?.userId,
    });
    // Create initial version
    await documentService.createDocumentVersion({
      documentId: document.id,
      versionNumber: 1,
      filePath: fileInfo.path,
    });
    res.status(201).json({
      id: document.id,
      title: document.title,
      fileUrl: fileInfo.url,
      status: document.status,
      createdAt: document.created_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    next(error);
  }
};
