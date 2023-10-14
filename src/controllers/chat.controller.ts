import { Request } from 'express';
import { createOrGetPersonalChatDto } from '../dtos/chat.dto';
import { _createOrGetPersonalChat } from '../services/chat.service';
import { ApiResponse } from '../utils/api-response';
import InputValidator from '../utils/validator';

export async function createOrGetPersonalChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(createOrGetPersonalChatDto, req.params);
  const personalChat = await _createOrGetPersonalChat(req.currentUser, data);
  return new ApiResponse(personalChat);
}
