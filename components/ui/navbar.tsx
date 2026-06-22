import Link from 'next/link';
import { Button } from './button';
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-mono text-xl font-medium tracking-tight text-[var(--color-text-primary)]">
            <span className="text-[var(--color-accent)]">Algo</span>Viz
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[var(--color-text-secondary)]">
          <Link href="/patterns" className="hover:text-[var(--color-text-primary)] transition-colors">
            Patterns
          </Link>
          <Link href="/pricing" className="hover:text-[var(--color-text-primary)] transition-colors">
            Pricing
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hover:text-[var(--color-text-primary)] transition-colors">Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Try Free &rarr;</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/app" className="hover:text-[var(--color-text-primary)] transition-colors">App</Link>
            <Link href="/dashboard" className="hover:text-[var(--color-text-primary)] transition-colors">Dashboard</Link>
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
