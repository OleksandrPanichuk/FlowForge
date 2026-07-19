import { NodeEnv } from "@repo/primitives";
import winston from "winston";
import { createCloudWatchTransport } from "./cloudwatch.js";
import type { LoggerOptions } from "./types.js";

function createConsoleFormat(environment?: NodeEnv) {
  if (environment === NodeEnv.Development) {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        ({
          environment: _environment,
          level,
          message,
          service: _service,
          stack,
          timestamp: logTimestamp,
          ...metadata
        }) => {
          const errorStack = typeof stack === "string" ? `\n${stack}` : "";
          const metadataText =
            Object.keys(metadata).length > 0
              ? ` ${JSON.stringify(metadata)}`
              : "";

          return [
            String(logTimestamp),
            `${level}:`,
            `${String(message)}${metadataText}${errorStack}`,
          ].join(" ");
        },
      ),
    );
  }

  return winston.format.json();
}

export function createTransports(options: LoggerOptions) {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: createConsoleFormat(options.environment),
    }),
  ];

  if (options.cloudWatch) {
    const cloudWatchTransport = createCloudWatchTransport(options.cloudWatch);

    if (cloudWatchTransport) {
      transports.push(cloudWatchTransport);
    }
  }

  return transports;
}
