import type { CreateDocumentDto } from '@pdf-kanban-board/shared/src/types';
import { createHash } from 'crypto';
import type { RequestHandler } from 'express-serve-static-core';
import { storeFile } from '../storage';
import {
  createDocumentService,
  createDocumentVersionService,
  deleteDocumentByIdService,
  getAllDocumentsService,
  getDocumentByIdService,
} from './document.service';

const uploadDocument: RequestHandler = async (req, res, next) => {
  console.log('uploadDocument body', req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedFile = await storeFile(req.file, {
      orgId: req.tenantContext?.orgId,
    });

    const contentHash = createHash('sha256').update(req.file.buffer).digest('hex');

    const data: CreateDocumentDto = {
      title: req.body.title,
      filePath: uploadedFile.path,
      orgId: parseInt(req.body.orgId, 10),
      uploadedBy: req.tenantContext?.userId ?? null,
      originalName: uploadedFile.originalName,
      contentHash: contentHash,
    };

    const document = await createDocumentService(data);

    await createDocumentVersionService({
      documentId: document.id,
      versionNumber: 1,
      filePath: uploadedFile.path,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

const getDocuments: RequestHandler = async (_req, res, next) => {
  try {
    const documents = await getAllDocumentsService();
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

const getDocumentById: RequestHandler = async (req, res, next) => {
  try {
    const document = await getDocumentByIdService(parseInt(req.params.id, 10));
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

const deleteDocumentById: RequestHandler = async (req, res, next) => {
  try {
    const documentId = parseInt(req.params.id, 10);
    await deleteDocumentByIdService(documentId);
    res.status(200).json({ message: `Document ${documentId} deleted` });
  } catch (error) {
    next(error);
  }
};

export { uploadDocument, getDocuments, getDocumentById, deleteDocumentById };
