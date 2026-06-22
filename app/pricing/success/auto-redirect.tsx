'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRedirect({ to, delay = 2000 }: { to: string, delay?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [router, to, delay]);

  return (
    <p className="text-sm text-[var(--color-text-muted)] animate-pulse mt-4">
      Redirecting you automatically in a few seconds...
    </p>
  );
}
