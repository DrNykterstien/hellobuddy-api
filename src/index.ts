import 'dotenv/config';
import env from './utils/env-vars';
import server from './server';
import { Server as HttpServer } from 'http';
import { dbConnect } from './utils/db';
import Logger from './utils/logger';

async function bootServer(): Promise<HttpServer> {
  try {
    await dbConnect();
  } catch (error) {
    Logger.error(`💥 Failed to boot the server 😞: ${error}`);
    process.exit(1);
  }

  return server.listen(env.PORT, () => {
    Logger.info(`🏁 Starting server in ${env.NODE_ENV} mode`);
    Logger.success(`🚀 Server ready at http://${env.HOST}:${env.PORT} 🎉`);
  });
}

bootServer();
