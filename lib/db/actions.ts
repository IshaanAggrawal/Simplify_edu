import { db } from './index';
import { users, visualizations, usage, chatMessages, chatSummaries, feedback } from './schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import { PLAN_LIMITS } from '../stripe';

// ────────────────────────────────────────────────
// User sync (upsert on login)
// ────────────────────────────────────────────────
export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id)
  });

  if (existingUser) return existingUser;

  const newUser = await db.insert(users).values({
    clerkId: clerkUser.id,
    email,
    name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
    plan: 'free'
  }).returning();

  return newUser[0];
}

// ────────────────────────────────────────────────
// Usage — check limit and increment
// ────────────────────────────────────────────────
export async function checkDailyLimit(
  userId: number,
  plan: string,
  type: 'trace' | 'chat' = 'trace'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0];
  
  // Fallback limits if plan not found
  const defaultLimits = { traces: 3, chats: 0 };
  const planLimits = PLAN_LIMITS[plan] ?? defaultLimits;
  const limit = type === 'trace' ? planLimits.traces : planLimits.chats;

  const todayUsage = await db.query.usage.findFirst({
    where: and(eq(usage.userId, userId), eq(usage.date, today))
  });

  const used = type === 'trace' ? (todayUsage?.runCount ?? 0) : (todayUsage?.chatCount ?? 0);
  
  // -1 means unlimited
  const allowed = limit === -1 || used < limit;
  
  return { allowed, used, limit };
}

export async function incrementUsage(userId: number, type: 'trace' | 'chat' = 'trace'): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const existing = await db.query.usage.findFirst({
    where: and(eq(usage.userId, userId), eq(usage.date, today))
  });

  if (existing) {
    if (type === 'trace') {
      await db.update(usage).set({ runCount: existing.runCount + 1 }).where(eq(usage.id, existing.id));
    } else {
      await db.update(usage).set({ chatCount: existing.chatCount + 1 }).where(eq(usage.id, existing.id));
    }
  } else {
    if (type === 'trace') {
      await db.insert(usage).values({ userId, date: today, runCount: 1, chatCount: 0 });
    } else {
      await db.insert(usage).values({ userId, date: today, runCount: 0, chatCount: 1 });
    }
  }
}

// ────────────────────────────────────────────────
// Spam Protection (Global DB Check)
// ────────────────────────────────────────────────
export async function checkSpamRateLimit(userId: number): Promise<boolean> {
  // Prevent more than 5 requests per minute combined (traces + chats)
  // Check how many traces in last minute
  const recentTraces = await db.query.visualizations.findMany({
    where: and(
      eq(visualizations.userId, userId),
      sql`${visualizations.createdAt} > NOW() - INTERVAL '1 minute'`
    )
  });

  // Check how many chats in last minute
  const recentChats = await db.query.chatMessages.findMany({
    where: and(
      eq(chatMessages.userId, userId),
      eq(chatMessages.role, 'user'),
      sql`${chatMessages.createdAt} > NOW() - INTERVAL '1 minute'`
    )
  });

  const totalRecentRequests = recentTraces.length + recentChats.length;
  return totalRecentRequests < 5;
}

// ────────────────────────────────────────────────
// Save a visualization trace
// ────────────────────────────────────────────────
export async function saveVisualization(userId: number, code: string, language: string, input: string, steps: any[]) {
  const result = await db.insert(visualizations).values({
    userId,
    code,
    language,
    input,
    stepsJson: steps,
  }).returning();
  return result[0];
}

// ────────────────────────────────────────────────
// Dashboard data
// ────────────────────────────────────────────────
export async function getUserDashboardData(userId: number) {
  const recentVisualizations = await db.query.visualizations.findMany({
    where: eq(visualizations.userId, userId),
    orderBy: (visualizations, { desc }) => [desc(visualizations.createdAt)],
    limit: 5
  });

  const today = new Date().toISOString().split('T')[0];
  const todayUsage = await db.query.usage.findFirst({
    where: and(eq(usage.userId, userId), eq(usage.date, today))
  });

  return {
    recentVisualizations,
    runsToday: todayUsage?.runCount || 0
  };
}

// ────────────────────────────────────────────────
// Chat messages — rolling window of 5 + summary
// ────────────────────────────────────────────────
export async function getChatContext(userId: number, sessionId: string) {
  const messages = await db.query.chatMessages.findMany({
    where: and(eq(chatMessages.userId, userId), eq(chatMessages.sessionId, sessionId)),
    orderBy: [desc(chatMessages.createdAt)],
    limit: 5,
  });

  const summary = await db.query.chatSummaries.findFirst({
    where: and(eq(chatSummaries.userId, userId), eq(chatSummaries.sessionId, sessionId)),
  });

  return {
    recentMessages: messages.reverse(), // oldest first for context
    summary: summary?.summary ?? null,
  };
}

export async function saveChatMessage(userId: number, sessionId: string, role: 'user' | 'assistant', content: string) {
  return db.insert(chatMessages).values({ userId, sessionId, role, content }).returning();
}

export async function updateChatSummary(userId: number, sessionId: string, summary: string) {
  const existing = await db.query.chatSummaries.findFirst({
    where: and(eq(chatSummaries.userId, userId), eq(chatSummaries.sessionId, sessionId)),
  });

  if (existing) {
    await db.update(chatSummaries)
      .set({ summary, updatedAt: new Date() })
      .where(eq(chatSummaries.id, existing.id));
  } else {
    await db.insert(chatSummaries).values({ userId, sessionId, summary });
  }
}

// ────────────────────────────────────────────────
// Feedback / Bug Reports
// ────────────────────────────────────────────────
export async function submitFeedback(userId: number | null, type: string, message: string) {
  return db.insert(feedback).values({ userId, type, message }).returning();
}
