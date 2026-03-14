import { Request, Response, NextFunction } from 'express';
import { decodeAccessToken } from '../utils/auth';
import prisma from '../utils/prisma';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  try {
    const payload = decodeAccessToken(token);
    const email = payload.sub;

    if (!email) {
      return res.status(401).json({ detail: 'Invalid token payload' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ detail: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }
};
