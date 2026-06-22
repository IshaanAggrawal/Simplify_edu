import { pgTable, text, serial, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  plan: text('plan').default('free').notNull(), // 'free', 'pro', 'lifetime'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const visualizations = pgTable('visualizations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  code: text('code').notNull(),
  language: text('language').notNull(),
  input: text('input'),
  stepsJson: jsonb('steps_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usage = pgTable('usage', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD string for simple tracking
  runCount: integer('run_count').default(0).notNull(),
});

export const savedPatterns = pgTable('saved_patterns', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  patternSlug: text('pattern_slug').notNull(),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
});
