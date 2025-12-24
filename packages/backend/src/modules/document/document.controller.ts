// packages/backend/src/modules/document/document.controller.ts

import type { CreateDocumentDto } from '@pdf-kanban-board/shared/src/types';
// import type { RequestHandler } from 'express';
import type { RequestHandler } from 'express-serve-static-core';
import { documentService } from './document.service';

export const uploadDocument: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data: CreateDocumentDto = {
      title: req.body.title,
      filePath: req.file.path,
      orgId: parseInt(req.body.orgId, 10),
      uploadedBy: req.tenantContext?.userId ?? null,
    };

    const document = await documentService.createDocument(data);

    await documentService.createDocumentVersion({
      documentId: document.id,
      versionNumber: 1,
      filePath: req.file.path,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};
