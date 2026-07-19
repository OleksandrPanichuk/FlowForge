import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestLogContext {
  httpMethod: string;
  httpPath: string;
  requestId: string;
}

const requestLogContext = new AsyncLocalStorage<RequestLogContext>();

export function getRequestLogContext() {
  return requestLogContext.getStore();
}

export function runWithRequestLogContext(
  context: RequestLogContext,
  callback: () => void,
) {
  requestLogContext.run(context, callback);
}
