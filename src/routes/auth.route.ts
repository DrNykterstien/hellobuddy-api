import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import asyncHandler from '../middlewares/async-handler.middleware';

const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));

export default authRouter;
