'use client';

import { useState } from 'react';
import { SignInButton } from '@clerk/nextjs';

interface PricingCardsProps {
  currentTier: string;
  userId: string | null;
}

export function PricingCards({ currentTier, userId }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'pro_max') => {
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
      <div className={`rounded-2xl border ${currentTier === 'free' ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent-glow)]' : 'border-[var(--color-border)]'} bg-[var(--color-bg-surface)] p-8 flex flex-col relative`}>
        {currentTier === 'free' && (
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</div>
        )}
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
          {currentTier === 'free' ? 'Active' : 'Free Plan'}
        </button>
      </div>

      {/* Pro Tier */}
      <div className={`rounded-2xl border ${currentTier === 'pro' ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent-glow)]' : 'border-[var(--color-border)]'} bg-[var(--color-bg-surface)] p-8 flex flex-col relative`}>
        {currentTier === 'pro' ? (
           <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</div>
        ) : (
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
        )}
        <h3 className="text-xl font-semibold mb-2">Pro</h3>
        <div className="text-4xl font-mono font-medium mb-1">$9<span className="text-lg text-[var(--color-text-muted)]">/mo</span></div>
        <div className="text-xs text-[var(--color-text-muted)] mb-6">Billed monthly</div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> 20 AI trace runs per day</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> AI Bug Detection + Fixes</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> AI Chat on any visualization</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Export animations</li>
        </ul>
        
        {currentTier === 'pro' || currentTier === 'pro_max' ? (
          <button disabled className="w-full rounded-md border border-[var(--color-border)] py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {currentTier === 'pro' ? 'Active' : 'Included in Pro Max'}
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

      {/* Pro Max Tier */}
      <div className={`rounded-2xl border ${currentTier === 'pro_max' ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent-glow)]' : 'border-[var(--color-border)]'} bg-[var(--color-bg-surface)] p-8 flex flex-col relative`}>
        {currentTier === 'pro_max' && (
           <div className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</div>
        )}
        <h3 className="text-xl font-semibold mb-2">Pro Max</h3>
        <div className="text-4xl font-mono font-medium mb-1">$19<span className="text-lg text-[var(--color-text-muted)]">/mo</span></div>
        <div className="text-xs text-[var(--color-text-muted)] mb-6">Billed monthly</div>
        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-secondary)]">
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Everything in Pro</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> 50 AI trace runs per day</li>
          <li className="flex items-center"><span className="text-[var(--color-success)] mr-2">✓</span> Priority AI processing</li>
        </ul>
        
        {currentTier === 'pro_max' ? (
          <button disabled className="w-full rounded-md border border-[var(--color-border)] py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Active
          </button>
        ) : userId ? (
          <button 
            onClick={() => handleUpgrade('pro_max')}
            disabled={loadingPlan !== null}
            className="w-full rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg-base)] py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {loadingPlan === 'pro_max' ? 'Redirecting...' : 'Get Pro Max'}
          </button>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="w-full rounded-md bg-[var(--color-text-primary)] text-[var(--color-bg-base)] py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              Sign In to Upgrade
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
