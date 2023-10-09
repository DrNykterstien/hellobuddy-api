import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ApiResponse, handleApiResponse } from '../utils/api-response';

type AsyncHandler = (req: Request, res: Response) => Promise<ApiResponse> | ApiResponse;

export default function asyncHandler(handler: AsyncHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const handlerData = await handler(req, res);
      return handleApiResponse(handlerData, res);
    } catch (error) {
      next(error);
    }
  };
}
