import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  type InputLogEvent,
} from '@aws-sdk/client-cloudwatch-logs';
import TransportStream from 'winston-transport';
import type { CloudWatchTransportOptions, LogInfo } from './types.js';
import {
  CLOUDWATCH_MAX_BATCH_BYTES,
  CLOUDWATCH_MAX_BATCH_SIZE,
  DEFAULT_CLOUDWATCH_ERROR_REPORT_INTERVAL_MS,
  DEFAULT_CLOUDWATCH_FLUSH_INTERVAL_MS,
  DEFAULT_CLOUDWATCH_MAX_BUFFERED_EVENTS,
} from '../../constants.js';
import {
  getCloudWatchTransportError,
  getEventBytes,
  getLogTimestamp,
  isRetryableCloudWatchError,
  sleep,
  stringifyLogInfo,
} from './utils.js';

export class CloudWatchTransport extends TransportStream {
  private readonly client: CloudWatchLogsClient;
  private readonly flushIntervalMs: number;
  private readonly errorReportIntervalMs: number;
  private readonly logGroupName: string;
  private readonly maxBufferedEvents: number;
  private readonly logStreamName: string;
  private readonly maxBatchSize: number;

  private batch: InputLogEvent[] = [];
  private batchBytes = 0;
  private activeFlush?: Promise<void>;
  private isClosing = false;
  private flushTimer?: NodeJS.Timeout;
  private lastBufferOverflowReportAt = 0;
  private lastErrorReportAt = 0;

  constructor(options: CloudWatchTransportOptions) {
    super({
      level: options.cloudWatch.level,
      silent: options.cloudWatch.silent,
    });

    this.client =
      options.client ??
      new CloudWatchLogsClient({
        region: options.cloudWatch.region,
      });
    this.flushIntervalMs =
      options.cloudWatch.flushIntervalMs ??
      DEFAULT_CLOUDWATCH_FLUSH_INTERVAL_MS;
    this.errorReportIntervalMs =
      options.cloudWatch.errorReportIntervalMs ??
      DEFAULT_CLOUDWATCH_ERROR_REPORT_INTERVAL_MS;

    this.logGroupName = options.cloudWatch.logGroupName;
    this.logStreamName = options.cloudWatch.logStreamName;
    this.maxBufferedEvents =
      options.cloudWatch.maxBufferedEvents ??
      DEFAULT_CLOUDWATCH_MAX_BUFFERED_EVENTS;
    this.maxBatchSize = Math.min(
      options.cloudWatch.maxBatchSize ?? CLOUDWATCH_MAX_BATCH_SIZE,
      CLOUDWATCH_MAX_BATCH_SIZE,
    );

    this.startFlushTimer();
  }

  log(info: LogInfo, next: () => void) {
    if (this.silent) {
      next();
      return;
    }

    setImmediate(() => {
      this.emit('logged', info);
    });

    this.addToBatch(this.toInputLogEvent(info));
    next();
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  close() {
    this.isClosing = true;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    return this.flush();
  }

  private addToBatch(event: InputLogEvent) {
    const eventBytes = getEventBytes(event);

    this.ensureBufferCapacity();

    if (
      this.batch.length >= this.maxBatchSize ||
      this.batchBytes + eventBytes > CLOUDWATCH_MAX_BATCH_BYTES
    ) {
      void this.flush();
    }

    this.batch.push(event);
    this.batchBytes += eventBytes;

    if (this.batch.length >= this.maxBatchSize) {
      void this.flush();
    }
  }

  private async flush() {
    if (this.activeFlush) {
      return this.activeFlush;
    }

    if (this.batch.length === 0) {
      return;
    }

    this.activeFlush = this.flushNextBatch();

    return this.activeFlush;
  }

  private async flushNextBatch(): Promise<void> {
    let batchBytes = 0;
    let logEvents: InputLogEvent[] = [];
    let shouldContinue = true;

    try {
      const nextBatch = this.takeNextBatch();
      batchBytes = nextBatch.batchBytes;
      logEvents = nextBatch.logEvents;

      if (logEvents.length === 0) {
        return;
      }

      await this.putLogEvents(logEvents);
      this.lastErrorReportAt = 0;
      this.resetBufferOverflowReportIfRecovered();
    } catch (error) {
      if (isRetryableCloudWatchError(error)) {
        if (this.isClosing) {
          this.reportUndeliveredEventsOnClose(logEvents.length);
        } else {
          this.requeueBatch(logEvents, batchBytes);
        }

        shouldContinue = false;
      }

      this.reportFlushError(error);
    } finally {
      this.activeFlush = undefined;

      if (shouldContinue && this.batch.length > 0) {
        await this.flush();
      }
    }
  }

  private takeNextBatch() {
    const logEvents: InputLogEvent[] = [];
    let batchBytes = 0;

    while (this.batch.length > 0 && logEvents.length < this.maxBatchSize) {
      const nextEvent = this.batch[0];

      if (!nextEvent) {
        break;
      }

      const nextEventBytes = getEventBytes(nextEvent);

      if (
        logEvents.length > 0 &&
        batchBytes + nextEventBytes > CLOUDWATCH_MAX_BATCH_BYTES
      ) {
        break;
      }

      this.batch.shift();
      logEvents.push(nextEvent);
      batchBytes += nextEventBytes;
    }

    this.batchBytes -= batchBytes;

    return {
      batchBytes,
      logEvents: logEvents.sort(
        (left, right) => (left.timestamp ?? 0) - (right.timestamp ?? 0),
      ),
    };
  }

  private requeueBatch(logEvents: InputLogEvent[], logEventsBytes: number) {
    this.batch = [...logEvents, ...this.batch];
    this.batchBytes += logEventsBytes;
    this.trimBufferToLimit();
  }

  private ensureBufferCapacity() {
    if (this.batch.length < this.maxBufferedEvents) {
      return;
    }

    this.dropOldestEvent();
    this.reportBufferOverflow();
  }

  private trimBufferToLimit() {
    while (this.batch.length > this.maxBufferedEvents) {
      this.dropOldestEvent();
    }
  }

  private dropOldestEvent() {
    const droppedEvent = this.batch.shift();

    if (droppedEvent) {
      this.batchBytes -= getEventBytes(droppedEvent);
    }
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);

    this.flushTimer.unref();
  }

  private toInputLogEvent(info: LogInfo): InputLogEvent {
    return {
      message: stringifyLogInfo(info),
      timestamp: getLogTimestamp(info),
    };
  }

  private async putLogEvents(logEvents: InputLogEvent[]) {
    try {
      await this.client.send(
        new PutLogEventsCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents,
        }),
      );
    } catch (error) {
      if (!isRetryableCloudWatchError(error)) {
        throw error;
      }

      await sleep(250);
      await this.client.send(
        new PutLogEventsCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents,
        }),
      );
    }
  }

  private reportFlushError(error: unknown) {
    const now = Date.now();

    if (
      this.lastErrorReportAt !== 0 &&
      now - this.lastErrorReportAt < this.errorReportIntervalMs
    ) {
      return;
    }

    this.lastErrorReportAt = now;

    const transportError =
      error instanceof Error ? error : getCloudWatchTransportError(error);

    this.emit('error', transportError);
  }

  private reportUndeliveredEventsOnClose(failedEventCount: number) {
    if (failedEventCount === 0 && this.batch.length === 0) {
      return;
    }

    this.emit(
      'error',
      new Error(
        [
          'CloudWatch transport closed before all logs were delivered.',
          `${failedEventCount + this.batch.length} event(s) were dropped.`,
        ].join(' '),
      ),
    );
  }

  private reportBufferOverflow() {
    const now = Date.now();

    if (
      this.lastBufferOverflowReportAt !== 0 &&
      now - this.lastBufferOverflowReportAt < this.errorReportIntervalMs
    ) {
      return;
    }

    this.lastBufferOverflowReportAt = now;
    this.emit(
      'error',
      new Error('CloudWatch log buffer is full. Dropping oldest log events.'),
    );
  }

  private resetBufferOverflowReportIfRecovered() {
    if (this.batch.length < this.maxBufferedEvents) {
      this.lastBufferOverflowReportAt = 0;
    }
  }

  override _final(callback: (error?: Error | null) => void) {
    this.close()
      .then(() => {
        callback();
      })
      .catch((error: unknown) => {
        callback(error instanceof Error ? error : new Error(String(error)));
      });
  }
}
