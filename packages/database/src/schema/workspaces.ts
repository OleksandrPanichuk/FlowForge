import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createBaseColumns } from './base-columns.js';

export const workspaces = pgTable(
  'workspaces',
  {
    ...createBaseColumns(),
    workosOrganizationId: text('workos_organization_id').notNull(),
    name: text('name').notNull(),
    deletedAt: timestamp('deleted_at', {
      mode: 'date',
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex('workspaces_workos_organization_id_unique').on(
      table.workosOrganizationId,
    ),
  ],
);

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;
