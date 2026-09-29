import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const friendRequestStatusEnum = pgEnum(
  'friend_request_status',
  [
    'PENDING',
    'ACCEPTED',
    'REJECTED',
  ],
);

export const friendRequests = pgTable(
  'friend_requests',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    senderId: integer('sender_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    receiverId: integer('receiver_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    status: friendRequestStatusEnum('status')
      .default('PENDING')
      .notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    senderReceiverUnique: unique(
      'friend_request_sender_receiver_unique',
    ).on(
      table.senderId,
      table.receiverId,
    ),
  }),
);