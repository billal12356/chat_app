import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './users.schema.js';

export const sessions = pgTable('sessions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  tokenHash: varchar('token_hash', {
    length: 64,
  })
    .notNull()
    .unique(),

  expiresAt: timestamp('expires_at').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
