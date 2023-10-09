import { NextFunction, Request, Response } from 'express';
import { getUserFromHeaders } from '../services/auth.service';

async function authenticated(req: Request, res: Response, next: NextFunction) {
  const currentUser = await getUserFromHeaders(req);
  if (!currentUser) {
    return res.status(401).json({
      data: null,
      message: 'Unauthorized'
    });
  }

  req.currentUser = currentUser;

  next();
}

export default authenticated;
