import type { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import type { CloudWatchLoggerOptions } from "../../types.js";

export interface CloudWatchTransportOptions {
  cloudWatch: Required<
    Pick<
      CloudWatchLoggerOptions,
      "enabled" | "logGroupName" | "logStreamName"
    >
  > &
    Omit<
      CloudWatchLoggerOptions,
      "enabled" | "logGroupName" | "logStreamName"
    >;
  client?: CloudWatchLogsClient;
}

export type LogInfo = Record<string | symbol, unknown>;
