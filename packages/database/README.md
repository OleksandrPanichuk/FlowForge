# `@repo/database`

Shared PostgreSQL access layer for FlowForge apps and workers.

It owns the Drizzle schema, generated migrations, and low-level database client.
It does not own API controllers or workflow business logic.

## Shared columns

Drizzle schemas compose shared columns instead of inheriting from a base model:

```ts
import { createBaseColumns } from '@repo/database';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const workflows = pgTable('workflows', {
  ...createBaseColumns(),
  name: text('name').notNull(),
});
```

`updatedAt` must be set by update queries. Soft-delete and version columns are
intentionally table-specific rather than part of every record.

## Identity and tenancy

FlowForge stores internal users, workspaces, and memberships while WorkOS stays
the source of truth for authentication and authorization. WorkOS identifiers
are unique external references; application relationships use internal UUIDs.

The initial schema contains:

- `users`
- `workspaces`
- `workspace_memberships`
- `workos_webhook_events`

## Local database

From the repository root:

```sh
docker compose -f docker.compose.yml up -d postgres
```

Use this URL in `apps/api/.env`:

```sh
DATABASE_URL=postgres://flowforge:flowforge@localhost:5432/flowforge
```

## Drizzle commands

Load `DATABASE_URL` from your shell, then run one of:

```sh
npm run db:generate -w @repo/database
npm run db:migrate -w @repo/database
npm run db:studio -w @repo/database
```
