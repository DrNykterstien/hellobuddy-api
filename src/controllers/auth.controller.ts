import { Request } from 'express';
import InputValidator from '../utils/validator';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { _login, _register } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';

export async function register(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(RegisterDto, req.body);
  const result = await _register(data);
  return new ApiResponse(result, 201);
}

export async function login(req: Request): Promise<ApiResponse> {
  const data = await InputValidator(LoginDto, req.body);
  const user = await _login(data);
  return new ApiResponse(user);
}
