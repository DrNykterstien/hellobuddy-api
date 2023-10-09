import { NextFunction, Request, Response } from 'express';
import { handleErrorResponse } from '../utils/api-response';

async function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  return handleErrorResponse(err, res);
}

export default errorHandler;
