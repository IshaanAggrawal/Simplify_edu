import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '../../../lib/stripe';
import { db } from '../../../lib/db';
import { users } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';
import { Button } from '../../../components/ui/button';

import { AutoRedirect } from './auto-redirect';

export default async function PricingSuccessPage({ 
  searchParams 
}: { 
  searchParams: { session_id?: string } 
}) {
  const sessionId = searchParams.session_id;
  
  if (!sessionId) {
    redirect('/pricing');
  }

  let success = false;
  let errorMsg = '';

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const dbUserId = session.metadata?.userId;
      const tier = session.metadata?.tier;
      
      if (dbUserId && tier) {
        // Update user's plan in DB
        await db.update(users)
          .set({ plan: tier })
          .where(eq(users.id, parseInt(dbUserId, 10)));
        
        success = true;
      } else {
        errorMsg = 'Invalid session metadata.';
      }
    } else {
      errorMsg = 'Payment was not successful or is still pending.';
    }
  } catch (err: any) {
    console.error('Error retrieving session:', err);
    errorMsg = 'Could not verify your payment session.';
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)]">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {success ? (
          <div className="max-w-md w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 shadow-xl shadow-[var(--color-accent)]/10">
            <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Welcome to the upgraded experience. Your account has been instantly upgraded.
            </p>
            
            <Link href="/app">
              <Button className="w-full h-12 shadow-[0_0_20px_rgba(123,111,240,0.3)]">
                Start Animating Code &rarr;
              </Button>
            </Link>

            <AutoRedirect to="/dashboard" delay={2000} />
          </div>
        ) : (
          <div className="max-w-md w-full rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-bg-surface)] p-8 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/20 text-[var(--color-error)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
            <p className="text-[var(--color-text-secondary)] mb-8">
              {errorMsg}
            </p>
            
            <Link href="/pricing">
              <Button variant="outline" className="w-full h-12 border-[var(--color-border)]">
                Return to Pricing
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
