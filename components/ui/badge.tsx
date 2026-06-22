import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './button';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          {
            'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]': variant === 'default',
            'bg-[var(--color-success)]/10 text-[var(--color-success)]': variant === 'success',
            'bg-[var(--color-warning)]/10 text-[var(--color-warning)]': variant === 'warning',
            'bg-[var(--color-error)]/10 text-[var(--color-error)]': variant === 'error',
            'border border-[var(--color-border)] text-[var(--color-text-secondary)]': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
