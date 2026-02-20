import 'express';
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
