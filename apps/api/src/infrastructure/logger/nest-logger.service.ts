import type { LoggerService } from '@nestjs/common';
import { createLogger } from '@repo/logger';
import type * as winston from 'winston';
import { getLoggerOptions } from './logger.config';
import { getRequestLogContext } from './request-log-context';

interface LogMetadata {
  context?: string;
  metadata?: unknown[];
  trace?: string;
}

export class NestLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(logger = createLogger(getLoggerOptions())) {
    this.logger = logger;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(
      formatMessage(message),
      withRequestLogContext(getLogMetadata(optionalParams)),
    );
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(
      formatMessage(message),
      withRequestLogContext(getErrorMetadata(optionalParams)),
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(
      formatMessage(message),
      withRequestLogContext(getLogMetadata(optionalParams)),
    );
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(
      formatMessage(message),
      withRequestLogContext(getLogMetadata(optionalParams)),
    );
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.logger.verbose(
      formatMessage(message),
      withRequestLogContext(getLogMetadata(optionalParams)),
    );
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(formatMessage(message), {
      ...withRequestLogContext(getErrorMetadata(optionalParams)),
      level: 'fatal',
    });
  }
}

function withRequestLogContext(metadata: LogMetadata) {
  return {
    ...getRequestLogContext(),
    ...metadata,
  };
}

function formatMessage(message: unknown) {
  if (message instanceof Error) {
    return message.message;
  }

  if (typeof message === 'string') {
    return message;
  }

  return JSON.stringify(message);
}

function getLogMetadata(optionalParams: unknown[]): LogMetadata {
  const context = getContext(optionalParams);
  const metadata = context ? optionalParams.slice(0, -1) : optionalParams;

  return {
    context,
    metadata: metadata.length > 0 ? metadata : undefined,
  };
}

function getErrorMetadata(optionalParams: unknown[]): LogMetadata {
  const context = getContext(optionalParams);
  const paramsWithoutContext = context
    ? optionalParams.slice(0, -1)
    : optionalParams;
  const trace = getTrace(paramsWithoutContext);
  const metadata = trace ? paramsWithoutContext.slice(1) : paramsWithoutContext;

  return {
    context,
    trace,
    metadata: metadata.length > 0 ? metadata : undefined,
  };
}

function getContext(optionalParams: unknown[]) {
  const lastParam = optionalParams.at(-1);

  return typeof lastParam === 'string' ? lastParam : undefined;
}

function getTrace(optionalParams: unknown[]) {
  const firstParam = optionalParams[0];

  return typeof firstParam === 'string' ? firstParam : undefined;
}
