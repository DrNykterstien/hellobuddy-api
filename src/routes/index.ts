import _ from 'lodash';
import { Application, Request, Router } from 'express';
import Logger from '../utils/logger';
import asyncHandler from '../middlewares/async-handler.middleware';
import { ApiResponse } from '../utils/api-response';
import swaggerRouter from './swagger.route';
import authRouter from './auth.route';
import userRouter from './user.route';
import chatRouter from './chat.route';

const apiRouteMap = {
  '/auth': authRouter,
  '/users': userRouter,
  '/chats': chatRouter
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
