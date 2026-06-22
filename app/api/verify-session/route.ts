import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '../../../lib/stripe';
import { db } from '../../../lib/db';
import { users } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { syncUser } from '../../../lib/db/actions';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { session_id } = await req.json();
    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed' }, { status: 400 });
    }

    const localUser = await syncUser();
    if (!localUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetTier = session.metadata?.tier;
    if (!targetTier || (targetTier !== 'pro' && targetTier !== 'lifetime')) {
      return NextResponse.json({ error: 'Invalid tier in session metadata' }, { status: 400 });
    }

    // Ensure this session belongs to the requesting user
    if (!session.metadata || session.metadata.userId !== String(localUser.id)) {
      return NextResponse.json({ error: 'You do not have permission to verify this session' }, { status: 403 });
    }

    // Upgrade the user
    await db.update(users)
      .set({ plan: targetTier })
      .where(eq(users.id, localUser.id));

    return NextResponse.json({ success: true, message: `Successfully upgraded to ${targetTier}` });
  } catch (error: any) {
    console.error('Verify session error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
