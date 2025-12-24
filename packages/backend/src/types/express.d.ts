import type { Request } from 'express-serve-static-core';

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
