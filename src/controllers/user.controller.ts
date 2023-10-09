import { Request } from 'express';
import InputValidator from '../utils/validator';
import { ChangePasswordDto, UpdateUserDto } from '../dtos/user.dto';
import { _changePassword, _deleteUser, _updateUser } from '../services/user.service';
import { ApiResponse } from '../utils/api-response';

export function currentUser(req: Request): ApiResponse {
  const { password, ...user } = req.currentUser;
  return new ApiResponse(user);
}

export async function updateUser(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(UpdateUserDto, req.body);
  const user = await _updateUser(req.currentUser, data);
  return new ApiResponse(user);
}

export async function deleteUser(req: Request): Promise<ApiResponse> {
  const result = await _deleteUser(req.currentUser);
  return new ApiResponse(result);
}

export async function changePassword(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(ChangePasswordDto, req.body);
  const result = await _changePassword(req.currentUser, data);
  return new ApiResponse(result);
}
