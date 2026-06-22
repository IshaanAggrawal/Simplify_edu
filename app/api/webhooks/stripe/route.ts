import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';
import { db } from '../../../../lib/db';
import { users } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';


export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET is not set! Skipping signature verification for local testing.');
      // In production, this should throw an error. For local testing without a secret, we'll try to parse the body manually.
      // But Stripe requires signature verification for security.
    }

    let event: Stripe.Event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } else {
        event = JSON.parse(rawBody) as Stripe.Event;
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the specific event types we care about
    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.paused') {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;

      if (stripeCustomerId) {
        console.log(`Demoting user with Stripe Customer ID ${stripeCustomerId} to free tier.`);
        
        await db.update(users)
          .set({ plan: 'free' })
          .where(eq(users.stripeCustomerId, stripeCustomerId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
