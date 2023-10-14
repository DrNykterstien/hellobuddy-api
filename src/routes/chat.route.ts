import { Router } from 'express';
import { createOrGetPersonalChat } from '../controllers/chat.controller';
import asyncHandler from '../middlewares/async-handler.middleware';
import authenticated from '../middlewares/auth.middleware';

const chatRouter = Router();

chatRouter.post('/personal/:receiverId', authenticated, asyncHandler(createOrGetPersonalChat));

export default chatRouter;
