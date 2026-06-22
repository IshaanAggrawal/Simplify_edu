import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe, PRICING } from '../../../lib/stripe';
import { syncUser } from '../../../lib/db/actions';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const tier = (body.plan || body.tier) as 'pro' | 'pro_max';

    if (!tier || !PRICING[tier]) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const localUser = await syncUser();
    if (!localUser) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const priceDetails = PRICING[tier];
    // In App Router, we can determine the origin from the request headers
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: localUser.email,
      client_reference_id: String(localUser.id),
      metadata: {
        userId: String(localUser.id),
        tier,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: priceDetails.name,
              description: `Upgrade your AlgoViz account to the ${tier} tier.`,
            },
            unit_amount: priceDetails.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create Stripe checkout session' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
