import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '../../../lib/stripe';
import { db } from '../../../lib/db';
import { users } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '../../../components/ui/navbar';
import { Button } from '../../../components/ui/button';
import { AutoRedirect } from './auto-redirect';

export default async function PricingSuccessPage({ 
  searchParams
}: { 
  searchParams: Promise<{ session_id?: string }>
}) {
  // ✅ FIXED: Next.js 16 requires awaiting searchParams
  const params = await searchParams;
  const sessionId = params.session_id;
  
  if (!sessionId) {
    redirect('/pricing');
  }

  let success = false;
  let tier = '';
  let errorMsg = '';

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const dbUserId = session.metadata?.userId;
      tier = session.metadata?.tier || '';
      
      if (dbUserId && tier) {
        // Update user's plan in DB
        await db.update(users)
          .set({ plan: tier })
          .where(eq(users.id, parseInt(dbUserId, 10)));
        
        success = true;
      } else {
        errorMsg = 'Invalid session metadata. Please contact support.';
      }
    } else {
      errorMsg = 'Payment was not successful or is still pending.';
    }
  } catch (err: any) {
    console.error('Error retrieving session:', err);
    errorMsg = 'Could not verify your payment session.';
  }

  const tierLabel = tier === 'pro' ? 'Pro' : tier === 'pro_max' ? 'Pro Max' : tier === 'lifetime' ? 'Lifetime' : 'Premium';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-base)] p-6">
      {success ? (
        <div className="max-w-md w-full rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-bg-surface)] p-10 shadow-2xl shadow-[var(--color-accent)]/10 text-center">
          {/* Animated check */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-[var(--color-accent)]/20 animate-ping opacity-50" />
            <div className="relative w-20 h-20 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {tierLabel} Activated
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Your account has been instantly upgraded to <strong className="text-[var(--color-text-primary)]">{tierLabel}</strong>. You now have access to all {tierLabel} features.
          </p>
          
          <Link href="/app">
            <Button className="w-full h-12 text-base shadow-[0_0_20px_rgba(123,111,240,0.4)] mb-4">
              Start Animating Code →
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-10 text-sm border-[var(--color-border)]">
              Go to Dashboard
            </Button>
          </Link>

          {/* Auto-redirect countdown */}
          <AutoRedirect to="/dashboard" delay={3000} />
        </div>
      ) : (
        <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-[var(--color-bg-surface)] p-10 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Verification Failed</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">{errorMsg}</p>
          
          <Link href="/pricing">
            <Button variant="outline" className="w-full h-12 border-[var(--color-border)]">
              Return to Pricing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
