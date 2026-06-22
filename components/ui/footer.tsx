import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-[var(--color-text-muted)] md:text-left">
          Built for CS students and engineers. &copy; {new Date().getFullYear()} AlgoViz.
        </p>
        <div className="flex items-center space-x-4 text-sm font-medium text-[var(--color-text-secondary)]">
          <Link href="/patterns" className="hover:text-[var(--color-text-primary)]">
            Patterns
          </Link>
          <Link href="/pricing" className="hover:text-[var(--color-text-primary)]">
            Pricing
          </Link>
          <a href="#" className="hover:text-[var(--color-text-primary)]">
            Twitter
          </a>
          <a href="#" className="hover:text-[var(--color-text-primary)]">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
