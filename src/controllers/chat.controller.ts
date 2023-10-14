import { Request } from 'express';
import { GetChatDto, createGroupChatDto, createOrGetPersonalChatDto } from '../dtos/chat.dto';
import { _createGroupChat, _createOrGetPersonalChat, _getChat } from '../services/chat.service';
import { ApiResponse } from '../utils/api-response';
import InputValidator from '../utils/validator';

export async function createOrGetPersonalChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(createOrGetPersonalChatDto, req.params);
  const personalChat = await _createOrGetPersonalChat(req.currentUser, data);
  return new ApiResponse(personalChat);
}

export async function createGroupChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(createGroupChatDto, req.body);
  const groupChat = await _createGroupChat(req.currentUser, data);
  return new ApiResponse(groupChat);
}

export async function getChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(GetChatDto, req.params);
  const chat = await _getChat(req.currentUser, data);
  return new ApiResponse(chat);
}
