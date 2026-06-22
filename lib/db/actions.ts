import { db } from './index';
import { users, visualizations, usage } from './schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id)
  });

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const newUser = await db.insert(users).values({
    clerkId: clerkUser.id,
    email: email,
    name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
    plan: 'free'
  }).returning();

  return newUser[0];
}

export async function getUserDashboardData(userId: number) {
  const recentVisualizations = await db.query.visualizations.findMany({
    where: eq(visualizations.userId, userId),
    orderBy: (visualizations, { desc }) => [desc(visualizations.createdAt)],
    limit: 5
  });

  const today = new Date().toISOString().split('T')[0];
  const todayUsage = await db.query.usage.findFirst({
    where: (usage, { and, eq }) => and(
      eq(usage.userId, userId),
      eq(usage.date, today)
    )
  });

  return {
    recentVisualizations,
    runsToday: todayUsage?.runCount || 0
  };
}
