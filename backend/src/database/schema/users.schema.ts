import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', {
    length: 50,
  }).notNull(),
  email: varchar('email', {
    length: 255,
  })
    .notNull()
    .unique(),

  password: varchar('password', {
    length: 255,
  }).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
