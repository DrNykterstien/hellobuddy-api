import { Router } from 'express';
import { sendMessage } from '../controllers/message.controller';
import asyncHandler from '../middlewares/async-handler.middleware';
import authenticated from '../middlewares/auth.middleware';

const messageRouter = Router();

messageRouter.route('/:chatId').all(authenticated).post(asyncHandler(sendMessage));

export default messageRouter;
