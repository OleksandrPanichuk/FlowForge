import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createBaseColumns } from './base-columns.js';

export const workosWebhookEvents = pgTable(
  'workos_webhook_events',
  {
    ...createBaseColumns(),
    workosEventId: text('workos_event_id').notNull(),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    processedAt: timestamp('processed_at', {
      mode: 'date',
      withTimezone: true,
    }),
    error: text('error'),
  },
  (table) => [
    uniqueIndex('workos_webhook_events_workos_id_unique').on(
      table.workosEventId,
    ),
    index('workos_webhook_events_processed_at_idx').on(table.processedAt),
  ],
);

export type WorkosWebhookEvent = typeof workosWebhookEvents.$inferSelect;
export type InsertWorkosWebhookEvent =
  typeof workosWebhookEvents.$inferInsert;
