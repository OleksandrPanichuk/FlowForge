import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { runWithRequestLogContext } from './request-log-context';

const REQUEST_ID_HEADER = 'x-request-id';

export function requestLogContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const requestId = getRequestId(request);

  response.setHeader(REQUEST_ID_HEADER, requestId);
  runWithRequestLogContext(
    {
      requestId,
      httpMethod: request.method,
      httpPath: request.path,
    },
    next,
  );
}

function getRequestId(request: Request) {
  const requestId = request.header(REQUEST_ID_HEADER);

  return requestId && requestId.length <= 128 ? requestId : randomUUID();
}
