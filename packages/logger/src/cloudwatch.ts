import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import type { CloudWatchLoggerOptions } from "./types.js";
import { CloudWatchTransport } from "./transports/cloudwatch/index.js";

type ConfiguredCloudWatchLoggerOptions = CloudWatchLoggerOptions & {
  enabled: true;
  logGroupName: string;
  logStreamName: string;
};

export function createCloudWatchLogsClient(
  options: CloudWatchLoggerOptions,
): CloudWatchLogsClient | undefined {
  if (!options.enabled) {
    return undefined;
  }

  return new CloudWatchLogsClient({
    region: options.region,
  });
}

export function isCloudWatchConfigured(
  options?: CloudWatchLoggerOptions,
): options is ConfiguredCloudWatchLoggerOptions {
  return Boolean(
    options?.enabled && options.logGroupName && options.logStreamName,
  );
}

export function createCloudWatchTransport(options: CloudWatchLoggerOptions) {
  if (!isCloudWatchConfigured(options)) {
    return undefined;
  }

  return new CloudWatchTransport({
    cloudWatch: {
      ...options,
    },
  });
}
