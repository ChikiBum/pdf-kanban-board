import type { CreateDocumentDto } from '@pdf-kanban-board/shared/src/types';
import { createHash } from 'crypto';
import type { RequestHandler } from 'express-serve-static-core';
import { storeFile } from '../storage/fileStorage.service';
import { createDocument, createDocumentVersion } from './document.service';

const uploadDocument: RequestHandler = async (req, res, next) => {
  console.log('uploadDocument body', req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = await storeFile(req.file);

    const contentHash = createHash('sha256').update(req.file.buffer).digest('hex');

    const data: CreateDocumentDto = {
      title: req.body.title,
      filePath: uploadedFile.path,
      orgId: parseInt(req.body.orgId, 10),
      uploadedBy: req.tenantContext?.userId ?? null,
      originalName: uploadedFile.originalName,
      contentHash: contentHash,
    };

    const document = await createDocument(data);

    await createDocumentVersion({
      documentId: document.id,
      versionNumber: 1,
      filePath: uploadedFile.path,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

const getAllDocuments: RequestHandler = async (req, res, next) => {
  try {
    const documents = await getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

export { uploadDocument, getAllDocuments };
