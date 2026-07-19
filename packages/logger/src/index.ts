import winston from 'winston';
import { DEFAULT_LOG_LEVEL, LOGGER_TIMESTAMP_FORMAT } from './constants.js';
import { createTransports } from './transports.js';
import type { LoggerOptions } from './types.js';

export function createLogger(options: LoggerOptions) {
  const logger = winston.createLogger({
    level: options.level ?? DEFAULT_LOG_LEVEL,
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({
        format: LOGGER_TIMESTAMP_FORMAT,
      }),
    ),
    defaultMeta: {
      service: options.serviceName,
      environment: options.environment,
    },
    transports: createTransports(options),
    exitOnError: false,
  });

  logger.on('error', (error) => {
    console.error('[logger]', error);
  });

  return logger;
}

export {
  createCloudWatchLogsClient,
  createCloudWatchTransport,
} from './cloudwatch.js';
export { CloudWatchTransport } from './transports/cloudwatch/index.js';
export type { CloudWatchLoggerOptions, LoggerOptions } from './types.js';
