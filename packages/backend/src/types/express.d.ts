// biome-ignore lint/correctness/noUnusedImports: Needed for global type augmentation
import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenantContext?: {
        orgId: number;
        userId: number;
      };
    }
  }
}
