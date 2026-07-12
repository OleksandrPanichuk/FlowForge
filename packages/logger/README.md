# `@repo/logger`

Shared logging package for FlowForge apps.

Current shape:

- Winston for the base logger API and console transport.
- Environment-aware console formatting.
- Optional CloudWatch Logs transport with batching.
- App-level config passes `serviceName`, `environment`, `level`, and CloudWatch settings.

Initial usage target:

```ts
import { createLogger } from "@repo/logger";
import { NodeEnv } from "@repo/primitives";

const logger = createLogger({
  serviceName: "api",
  environment: NodeEnv.Development,
});

logger.info("Logger is ready");
```

CloudWatch logging is opt-in:

```ts
const logger = createLogger({
  serviceName: "api",
  environment: NodeEnv.Production,
  cloudWatch: {
    enabled: true,
    region: process.env.AWS_REGION,
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
    logStreamName: process.env.CLOUDWATCH_LOG_STREAM,
  },
});
```
