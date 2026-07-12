import { NodeEnv } from '@repo/primitives';
import type { LoggerOptions } from '@repo/logger';

const DEFAULT_SERVICE_NAME = 'api';

export function getLoggerOptions(): LoggerOptions {
  const cloudWatchEnabled = process.env.CLOUDWATCH_ENABLED === 'true';

  return {
    serviceName: process.env.SERVICE_NAME ?? DEFAULT_SERVICE_NAME,
    environment: getNodeEnv(process.env.NODE_ENV),
    level: process.env.LOG_LEVEL,
    cloudWatch: {
      enabled: cloudWatchEnabled,
      level: process.env.CLOUDWATCH_LOG_LEVEL,
      region: process.env.AWS_REGION,
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
      logStreamName: process.env.CLOUDWATCH_LOG_STREAM,
    },
  };
}

function getNodeEnv(nodeEnv?: string): NodeEnv {
  switch (nodeEnv) {
    case NodeEnv.Production:
      return NodeEnv.Production;
    case NodeEnv.Test:
      return NodeEnv.Test;
    default:
      return NodeEnv.Development;
  }
}
