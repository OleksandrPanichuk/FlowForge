import { index, pgEnum, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { createBaseColumns } from './base-columns.js';
import { users } from './users.js';
import { workspaces } from './workspaces.js';

export const workspaceMembershipStatus = pgEnum(
  'workspace_membership_status',
  ['active', 'inactive', 'pending'],
);

export const workspaceMemberships = pgTable(
  'workspace_memberships',
  {
    ...createBaseColumns(),
    workosMembershipId: text('workos_membership_id').notNull(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: workspaceMembershipStatus('status').notNull(),
  },
  (table) => [
    uniqueIndex('workspace_memberships_workos_id_unique').on(
      table.workosMembershipId,
    ),
    uniqueIndex('workspace_memberships_workspace_user_unique').on(
      table.workspaceId,
      table.userId,
    ),
    index('workspace_memberships_workspace_id_idx').on(table.workspaceId),
    index('workspace_memberships_user_id_idx').on(table.userId),
  ],
);

export type WorkspaceMembership = typeof workspaceMemberships.$inferSelect;
export type InsertWorkspaceMembership =
  typeof workspaceMemberships.$inferInsert;
