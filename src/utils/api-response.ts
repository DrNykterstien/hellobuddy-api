import { Response } from 'express';
import statuses from '../constants/api-statuses';
import ApiError from './api-error';

export class ApiResponse {
  constructor(
    public data: any,
    public statusCode = 200,
    public message = 'Operation done successfully'
  ) {}
}

export function handleApiResponse(customRes: ApiResponse, res: Response) {
  const { statusCode, ...payload } = customRes;
  res.status(statusCode);
  return res.json(payload);
}

export function handleErrorResponse(error: any, res: Response) {
  if (!(error instanceof ApiError)) error = new ApiError();
  let statusCode, message;
  const code = error['code'];
  if (code && statuses[code] !== undefined) {
    const obj = statuses[code];
    statusCode = obj.statusCode;
    message = obj.message;
  } else {
    statusCode = error.code;
    message = error.message;
  }
  res.status(statusCode);
  return res.json({ data: null, message });
}
