import { Router } from 'express';
import { extractTenantContextMiddleware, uploadMiddleware } from '../../middleware';
import { getAllDocumentsDo, uploadDocument } from './document.controller';

const router = Router();

router.post('/', extractTenantContextMiddleware, uploadMiddleware.single('file'), uploadDocument);

router.get('/:id', extractTenantContextMiddleware, getAllDocumentsDo);

export default router;
