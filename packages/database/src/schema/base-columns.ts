import { timestamp, uuid } from 'drizzle-orm/pg-core';

export function createBaseColumns() {
  return {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  };
}
