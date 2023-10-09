import { Router } from 'express';
import asyncHandler from '../middlewares/async-handler.middleware';
import {
  changePassword,
  currentUser,
  deleteUser,
  updateUser
} from '../controllers/user.controller';
import authenticated from '../middlewares/auth.middleware';

const userRouter = Router();

userRouter
  .route('/')
  .all(authenticated)
  .get(asyncHandler(currentUser))
  .patch(asyncHandler(updateUser))
  .delete(asyncHandler(deleteUser));

userRouter.patch('/change-password', authenticated, asyncHandler(changePassword));

export default userRouter;
