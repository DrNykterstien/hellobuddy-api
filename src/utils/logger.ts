import winston, { format } from 'winston';
import chalk from 'chalk';
import { resolve } from 'path';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    success: 3
  },
  colors: {
    error: chalk.red.bold,
    warn: chalk.yellow.bold,
    info: chalk.white,
    success: chalk.green.bold
  }
};

const timestampFormat = format.timestamp({
  format: 'DD-MM-YYYY HH:mm:ss.SSS'
});

const simpleOutputFormat = format.printf(log => {
  return `${log.timestamp}\t${log.level}: ${log.message}`;
});

const coloredOutputFormat = format.printf(log => {
  const definedColors = customLevels.colors;
  const color = definedColors[log.level as keyof typeof definedColors];
  return `${log.timestamp}\t${color(log.message)}`;
});

const logFolderPath = './logs';

const fileFormat = format.combine(timestampFormat, simpleOutputFormat);

const consoleFormat = format.combine(timestampFormat, coloredOutputFormat);

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: resolve(logFolderPath, 'error.log'),
      format: fileFormat
    }),
    new winston.transports.Console({
      level: 'success',
      format: consoleFormat
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: resolve(logFolderPath, 'exceptions.log'),
      format: fileFormat
    }),
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

const Logger = {
  error: (message: string, meta?: any): winston.Logger => logger.error(message, meta),
  warn: (message: string, meta?: any): winston.Logger => logger.warn(message, meta),
  info: (message: string, meta?: any): winston.Logger => logger.info(message, meta),
  success: (message: string, meta?: any): winston.Logger => logger.log('success', message, meta)
};

export default Logger;
