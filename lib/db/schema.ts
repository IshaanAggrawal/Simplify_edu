import { pgTable, text, serial, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  // 'free' | 'pro' | 'pro_max' | 'lifetime'
  plan: text('plan').default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
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

// Chat message storage for AI Chat feature
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  sessionId: text('session_id').notNull(), // groups messages per visualization session
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Rolling summary of chat history older than last 5 messages
export const chatSummaries = pgTable('chat_summaries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  sessionId: text('session_id').notNull().unique(),
  summary: text('summary').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
