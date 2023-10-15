import { Router } from 'express';
import {
  addParticipants,
  createGroupChat,
  createOrGetPersonalChat,
  getChat,
  removeParticipant
} from '../controllers/chat.controller';
import asyncHandler from '../middlewares/async-handler.middleware';
import authenticated from '../middlewares/auth.middleware';

const chatRouter = Router();

chatRouter.use(authenticated);

chatRouter.get('/:chatId', asyncHandler(getChat));

chatRouter.post('/personal/:receiverId', asyncHandler(createOrGetPersonalChat));

chatRouter.post('/group', asyncHandler(createGroupChat));

chatRouter.post('/group/:chatId/participants', asyncHandler(addParticipants));
chatRouter.delete('/group/:chatId/participants/:participantId', asyncHandler(removeParticipant));

export default chatRouter;
