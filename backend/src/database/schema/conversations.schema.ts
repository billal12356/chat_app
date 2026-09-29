import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
} from 'drizzle-orm/pg-core';

export const conversationTypeEnum =
  pgEnum('conversation_type', [
    'DIRECT',
    'GROUP',
  ]);

export const conversations =
  pgTable('conversations', {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    type: conversationTypeEnum('type')
      .default('DIRECT')
      .notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  });