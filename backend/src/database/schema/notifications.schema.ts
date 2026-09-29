import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const notificationTypeEnum = pgEnum(
  'notification_type',
  [
    'FRIEND_REQUEST',
    'FRIEND_REQUEST_ACCEPTED',
    'NEW_MESSAGE',
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    userId: integer('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    type: notificationTypeEnum('type')
      .notNull(),

    title: text('title').notNull(),

    message: text('message').notNull(),

    isRead: integer('is_read')
      .default(0)
      .notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),
  },
);