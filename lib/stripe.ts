import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-05-27.dahlia',
});

// Plan limits per day for AI traces
export const PLAN_LIMITS: Record<string, { traces: number; chats: number }> = {
  free: { traces: 3, chats: 0 },
  pro: { traces: 20, chats: 50 },
  pro_max: { traces: 50, chats: -1 }, // -1 means unlimited
};

// Stripe product metadata — amounts in cents
export const PRICING = {
  pro: { amount: 900, name: 'AlgoViz Pro — Monthly', interval: 'month' },
  pro_max: { amount: 1900, name: 'AlgoViz Pro Max — Monthly', interval: 'month' },
} as const;

export type PlanTier = 'free' | 'pro' | 'pro_max';
