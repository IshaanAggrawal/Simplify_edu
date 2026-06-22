'use client';

import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';

interface PricingCardsProps {
  currentTier: string;
  userId: string | null;
}

export function PricingCards({ currentTier, userId }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'lifetime') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Tier */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">Free</h3>
        <div className="text-4xl font-mono font-medium mb-6">$0</div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> 3 free trace runs per day</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Full pattern library (view only)</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Basic animation controls</li>
        </ul>
        <button 
          disabled={currentTier === 'free'}
          className="w-full rounded-md border border-[var(--color-border)] py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-bg-elevated)] transition-colors"
        >
          {currentTier === 'free' ? 'Current Plan' : 'Free Plan'}
        </button>
      </div>

      {/* Pro Tier */}
      <div className="rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-bg-surface)] p-8 flex flex-col relative shadow-lg shadow-[var(--color-accent-glow)]">
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
        <h3 className="text-xl font-semibold mb-2">Pro</h3>
        <div className="text-4xl font-mono font-medium mb-1">$12<span className="text-lg text-[var(--color-text-muted)]">/mo</span></div>
        <div className="text-xs text-[var(--color-text-muted)] mb-6">Billed annually ($99/year)</div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Unlimited AI animations</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> AI Bug Detection + Fixes</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> AI Chat on any visualization</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Export animations</li>
        </ul>
        
        {currentTier === 'pro' || currentTier === 'lifetime' ? (
          <button disabled className="w-full rounded-md bg-[var(--color-accent)]/50 py-2 text-sm font-medium text-white cursor-not-allowed">
            {currentTier === 'pro' ? 'Current Plan' : 'Included in Lifetime'}
          </button>
        ) : userId ? (
          <button 
            onClick={() => handleUpgrade('pro')}
            disabled={loadingPlan !== null}
            className="w-full rounded-md bg-[var(--color-accent)] py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {loadingPlan === 'pro' ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="w-full rounded-md bg-[var(--color-accent)] py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors">
              Sign In to Upgrade
            </button>
          </SignInButton>
        )}
      </div>

      {/* Lifetime Tier */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">Lifetime</h3>
        <div className="text-4xl font-mono font-medium mb-1">$199</div>
        <div className="text-xs text-[var(--color-text-muted)] mb-6">Pay once, own forever</div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Everything in Pro</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Never pay a subscription</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Early access to new features</li>
        </ul>
        
        {currentTier === 'lifetime' ? (
          <button disabled className="w-full rounded-md border border-[var(--color-border)] opacity-50 py-2 text-sm font-medium cursor-not-allowed">
            Current Plan
          </button>
        ) : userId ? (
          <button 
            onClick={() => handleUpgrade('lifetime')}
            disabled={loadingPlan !== null}
            className="w-full rounded-md border border-[var(--color-border)] py-2 text-sm font-medium hover:bg-[var(--color-bg-elevated)] transition-colors"
          >
            {loadingPlan === 'lifetime' ? 'Redirecting...' : 'Get Lifetime'}
          </button>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="w-full rounded-md border border-[var(--color-border)] py-2 text-sm font-medium hover:bg-[var(--color-bg-elevated)] transition-colors">
              Sign In to Upgrade
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
