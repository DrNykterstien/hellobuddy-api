import { Request } from 'express';
import {
  AddParticipantsDto,
  CreateGroupChatDto,
  CreateOrGetPersonalChatDto,
  GetChatDto
} from '../dtos/chat.dto';
import {
  _addParticipants,
  _createGroupChat,
  _createOrGetPersonalChat,
  _getChat
} from '../services/chat.service';
import { ApiResponse } from '../utils/api-response';
import InputValidator from '../utils/validator';

export async function getChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(GetChatDto, req.params);
  const chat = await _getChat(req.currentUser, data);
  return new ApiResponse(chat);
}

export async function createOrGetPersonalChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(CreateOrGetPersonalChatDto, req.params);
  const personalChat = await _createOrGetPersonalChat(req.currentUser, data);
  return new ApiResponse(personalChat);
}

export async function createGroupChat(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(CreateGroupChatDto, req.body);
  const groupChat = await _createGroupChat(req.currentUser, data);
  return new ApiResponse(groupChat);
}

export async function addParticipants(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(AddParticipantsDto, { ...req.body, ...req.params });
  const chat = await _addParticipants(req.currentUser, data);
  return new ApiResponse(chat);
}
