import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-glow)] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[var(--color-accent)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent-hover)]':
              variant === 'primary',
            'bg-transparent hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]':
              variant === 'ghost',
            'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)] text-[var(--color-text-primary)]':
              variant === 'outline',
            'h-9 px-3 text-[var(--text-sm)]': size === 'sm',
            'h-10 px-4 text-[var(--text-base)]': size === 'md',
            'h-11 px-8 text-[var(--text-lg)]': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
