import {
  integer,
  pgTable,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

import { conversations } from './conversations.schema.js';
import { users } from './users.schema.js';

export const conversationMembers =
  pgTable(
    'conversation_members',
    {
      id: integer('id')
        .primaryKey()
        .generatedAlwaysAsIdentity(),

      conversationId: integer(
        'conversation_id',
      )
        .notNull()
        .references(
          () => conversations.id,
          {
            onDelete: 'cascade',
          },
        ),

      userId: integer('user_id')
        .notNull()
        .references(() => users.id, {
          onDelete: 'cascade',
        }),

      joinedAt: timestamp('joined_at')
        .defaultNow()
        .notNull(),
    },

    (table) => ({
      conversationUserUnique:
        unique(
          'conversation_user_unique',
        ).on(
          table.conversationId,
          table.userId,
        ),
    }),
  );