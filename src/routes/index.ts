import { Application, Request, Router } from 'express';
import _ from 'lodash';
import asyncHandler from '../middlewares/async-handler.middleware';
import { ApiResponse } from '../utils/api-response';
import Logger from '../utils/logger';
import authRouter from './auth.route';
import chatRouter from './chat.route';
import messageRouter from './message.route';
import swaggerRouter from './swagger.route';
import userRouter from './user.route';

const apiRouteMap = {
  '/auth': authRouter,
  '/users': userRouter,
  '/chats': chatRouter,
  '/messages': messageRouter
};

function addApiRoutes(app: Application) {
  app.get(
    '/healthcheck',
    asyncHandler(async () => {
      return new ApiResponse({
        uptime: process.uptime(),
        responseTime: process.hrtime(),
        timestamp: Date.now()
      });
    })
  );

  app.use(swaggerRouter);

  _.each(apiRouteMap, (router: Router, route: string) => {
    app.use(route, router);
  });

  app.use(
    asyncHandler(async (req: Request) => {
      return new ApiResponse(null, 404, `Unknown request URL (${req.method}: ${req.path})`);
    })
  );

  Logger.success('🔗 Routes added successfully 🎉');
}

export default addApiRoutes;
