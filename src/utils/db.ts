import { Sequelize } from 'sequelize-typescript';
import Logger from './logger';
import models from '../models';
import cls from 'cls-hooked';
import env from './env-vars';

const sequelizeNameSpace = cls.createNamespace('sequelize-namespace');
Sequelize.useCLS(sequelizeNameSpace);

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
  models: models
});

export async function dbConnect() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    Logger.success(`🔌 Connected to ${env.DB_NAME} Database successfully 🎉`);
  } catch (error) {
    Logger.error(`💥 Unable to connect to the ${env.DB_NAME} Database 😞: ${error}`);
    process.exit(1);
  }
}

export default sequelize;
