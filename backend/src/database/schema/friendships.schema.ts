import {
  integer,
  pgTable,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const friendships = pgTable(
  'friendships',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    userId: integer('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    friendId: integer('friend_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    userFriendUnique: unique(
      'friendship_user_friend_unique',
    ).on(
      table.userId,
      table.friendId,
    ),
  }),
);