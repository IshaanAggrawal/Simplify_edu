import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-05-27.dahlia', // Matches installed SDK version
});

export const PRICING = {
  pro: { amount: 1200, name: 'Pro Plan - AlgoViz' }, // $12.00
  lifetime: { amount: 19900, name: 'Lifetime Plan - AlgoViz' }, // $199.00
};
