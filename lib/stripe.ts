import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-05-27.dahlia',
});

// Plan limits per day for AI traces
export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  pro: 20,
  pro_max: 50,
};

// Stripe product metadata — amounts in cents
export const PRICING = {
  pro: { amount: 900, name: 'AlgoViz Pro — Monthly', interval: 'month' },
  pro_max: { amount: 1900, name: 'AlgoViz Pro Max — Monthly', interval: 'month' },
} as const;

export type PlanTier = 'free' | 'pro' | 'pro_max';
