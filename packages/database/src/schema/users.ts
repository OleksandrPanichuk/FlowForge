import { sql } from 'drizzle-orm';
import { text, timestamp, uniqueIndex, pgTable } from 'drizzle-orm/pg-core';
import { createBaseColumns } from './base-columns.js';

export const users = pgTable(
  'users',
  {
    ...createBaseColumns(),
    workosUserId: text('workos_user_id').notNull(),
    email: text('email').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    profilePictureUrl: text('profile_picture_url'),
    deletedAt: timestamp('deleted_at', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex('users_workos_user_id_unique').on(table.workosUserId),
    uniqueIndex('users_email_unique').on(sql`lower(${table.email})`),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
