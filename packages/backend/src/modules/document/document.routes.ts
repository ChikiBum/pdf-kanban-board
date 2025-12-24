import { Router } from 'express';
import extractTenantContextMiddleware from '../../middleware/checkOrgId.middleware';
import { uploadMiddleware } from '../../middleware/file-upload.middleware';
import { uploadDocument } from './document.controller';

const router = Router();

router.post(
  '/documents',
  extractTenantContextMiddleware,
  uploadMiddleware.single('file'),
  uploadDocument,
);

export default router;
