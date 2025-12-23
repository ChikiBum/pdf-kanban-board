import type { NextFunction, Request, Response } from 'express';

export const extractTenantContext = (req: Request, res: Response, next: NextFunction) => {
  const orgId = req.cookies['org_id'];
  const userId = req.cookies['user_id'];

  if (!orgId || !userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing tenant context' });
  }

  req.tenantContext = {
    orgId: parseInt(orgId, 10),
    userId: parseInt(userId, 10),
  };

  next();
};
