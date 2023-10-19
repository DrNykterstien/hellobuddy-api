import { Request } from 'express';
import { SendMessageDto } from '../dtos/message.dto';
import { _sendMessage } from '../services/message.service';
import { ApiResponse } from '../utils/api-response';
import InputValidator from '../utils/validator';

export async function sendMessage(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(SendMessageDto, { ...req.body, ...req.params });
  const message = await _sendMessage(req.currentUser, data);
  return new ApiResponse(message);
}
