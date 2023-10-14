import { Router } from 'express';
import { createGroupChat, createOrGetPersonalChat, getChat } from '../controllers/chat.controller';
import asyncHandler from '../middlewares/async-handler.middleware';
import authenticated from '../middlewares/auth.middleware';

const chatRouter = Router();

chatRouter.get('/:chatId', authenticated, asyncHandler(getChat));

chatRouter.post('/personal/:receiverId', authenticated, asyncHandler(createOrGetPersonalChat));

chatRouter.post('/group', authenticated, asyncHandler(createGroupChat));

export default chatRouter;
