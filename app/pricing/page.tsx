import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../lib/db';
import { users } from '../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { PricingCards } from './pricing-cards';

export default async function PricingPage() {
  const { userId } = await auth();
  
  let currentTier = 'free';
  if (userId) {
    const userRecords = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    if (userRecords.length > 0) {
      currentTier = userRecords[0].plan;
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">One tool. The complete loop.</h1>
          <p className="text-xl text-[var(--color-text-secondary)]">Learn &rarr; Code &rarr; Animate &rarr; Fix &rarr; Repeat.</p>
        </div>

        <PricingCards currentTier={currentTier} userId={userId} />
      </main>
      <Footer />
    </>
  );
}
