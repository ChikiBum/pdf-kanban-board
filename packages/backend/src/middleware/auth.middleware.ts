import type { NextFunction, Request, Response } from 'express-serve-static-core';

export const authMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
