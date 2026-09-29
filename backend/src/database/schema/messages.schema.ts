import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { conversations } from './conversations.schema.js';
import { users } from './users.schema.js';

export const messageStatusEnum =
  pgEnum('message_status', [
    'SENT',
    'DELIVERED',
    'READ',
  ]);

export const messages = pgTable(
  'messages',
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

    senderId: integer('sender_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    content: text('content').notNull(),

    status: messageStatusEnum('status')
      .default('SENT')
      .notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
);