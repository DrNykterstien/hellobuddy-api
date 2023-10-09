import cors from 'cors';
import helmet from 'helmet';
import express, { json, urlencoded } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { initSocketIO } from './socket';
import addApiRoutes from './routes';
import env from './utils/env-vars';
import errorHandler from './middlewares/error.middleware';
import Logger from './utils/logger';

function buildServer(): HttpServer {
  const allowedOrigins = env.CORS_ORIGINS.split(',').map(o => o.trim());
  const corsOptions = {
    origin: allowedOrigins,
    credentials: true
  };

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: corsOptions
  });

  app.set('io', io);
  initSocketIO(io);

  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '16kb' }));

  app.use(cors(corsOptions));

  app.use(helmet());
  app.disable('x-powered-by');

  Logger.info(`🔧 Started ${env.APP_NAME} App`);

  addApiRoutes(app);

  app.use(errorHandler);

  return httpServer;
}

export default buildServer();
