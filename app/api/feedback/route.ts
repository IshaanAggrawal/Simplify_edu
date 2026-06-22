import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncUser, submitFeedback } from '../../../lib/db/actions';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    let localUserId: number | null = null;

    // Optional auth: We allow both authenticated and anonymous feedback,
    // but if they are signed in, we link it to their user account.
    if (clerkId) {
      const localUser = await syncUser();
      if (localUser) {
        localUserId = localUser.id;
      }
    }

    const body = await req.json();
    const { type, message } = body;

    if (!type || !message || message.trim() === '') {
      return NextResponse.json({ error: 'Type and message are required' }, { status: 400 });
    }

    await submitFeedback(localUserId, type, message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting feedback.' },
      { status: 500 }
    );
  }
}
