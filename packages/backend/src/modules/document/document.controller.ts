import type { RequestHandler } from 'express-serve-static-core';
import {
  createDocumentService,
  deleteDocumentByIdService,
  getAllDocumentsService,
  getDocumentByIdService,
} from './document.service';

const uploadDocument: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = await createDocumentService({
      file: req.file,
      title: req.body.title,
      orgId: req.body.orgId,
      userId: req.tenantContext?.userId,
    });

    //it make sense to use when we know that document is already exists but edited
    // await createDocumentVersionService({
    //   documentId: document.id,
    //   versionNumber: 1,
    //   filePath: uploadedFile.path,
    // });

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
