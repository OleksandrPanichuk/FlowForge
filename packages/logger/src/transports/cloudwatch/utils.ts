import type { InputLogEvent } from '@aws-sdk/client-cloudwatch-logs';
import { CLOUDWATCH_LOG_EVENT_OVERHEAD_BYTES } from '../../constants.js';
import type { LogInfo } from './types.js';

export function getEventBytes(event: InputLogEvent) {
  return (
    Buffer.byteLength(event.message ?? '', 'utf-8') +
    CLOUDWATCH_LOG_EVENT_OVERHEAD_BYTES
  );
}

export function stringifyLogInfo(info: LogInfo) {
  const seen = new WeakSet<object>();

  return JSON.stringify(info, (_key, value: unknown) => {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }

      seen.add(value);
    }

    return value;
  });
}

export function getLogTimestamp(info: LogInfo) {
  const timestamp = info.timestamp;

  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const parsedTimestamp = new Date(timestamp).getTime();

    if (Number.isFinite(parsedTimestamp)) {
      return parsedTimestamp;
    }
  }

  return Date.now();
}

export function isRetryableCloudWatchError(error: unknown) {
  if (!isAwsError(error)) {
    return false;
  }

  return (
    error.$retryable !== undefined ||
    error.name === 'ThrottlingException' ||
    error.name === 'ServiceUnavailableException' ||
    error.name === 'TooManyRequestsException'
  );
}

export function getCloudWatchTransportError(cause?: unknown) {
  return new Error('CloudWatch log flush failed.', { cause });
}

export function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function isAwsError(error: unknown): error is {
  $retryable?: unknown;
  name?: string;
} {
  return typeof error === 'object' && error !== null;
}
