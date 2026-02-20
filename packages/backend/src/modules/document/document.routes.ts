import { Router } from 'express';
import { extractTenantContextMiddleware, uploadMiddleware } from '../../middleware';
import {
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from './document.controller';

const documentRouter = Router();

documentRouter.post(
  '/',
  extractTenantContextMiddleware,
  uploadMiddleware.single('file'),
  uploadDocument,
);

documentRouter.get('/all', extractTenantContextMiddleware, getDocuments);
documentRouter.get('/:id', extractTenantContextMiddleware, getDocumentById);
documentRouter.post('/:id', extractTenantContextMiddleware, deleteDocumentById);

export default documentRouter;
