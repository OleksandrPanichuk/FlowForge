import type { NodeEnv } from "@repo/primitives";

export interface CloudWatchLoggerOptions {
  enabled: boolean;
  logGroupName?: string;
  logStreamName?: string;
  region?: string;
  level?: string;
  silent?: boolean;
  flushIntervalMs?: number;
  maxBatchSize?: number;
  maxBufferedEvents?: number;
  errorReportIntervalMs?: number;
}

export interface LoggerOptions {
  serviceName: string;
  environment?: NodeEnv;
  level?: string;
  cloudWatch?: CloudWatchLoggerOptions;
}
