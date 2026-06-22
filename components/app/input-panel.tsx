'use client';

import { useState } from 'react';

interface InputPanelProps {
  onAnimate: (input: string) => void;
  isLoading: boolean;
}

export function InputPanel({ onAnimate, isLoading }: InputPanelProps) {
  const [inputVal, setInputVal] = useState('1, 2, 3, 4, 5');

  return (
    <div className="mt-4 p-4 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Input Data</label>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        placeholder="e.g. 1, 2, 3, 4, 5"
        className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-shadow mb-4"
      />
      <button
        onClick={() => onAnimate(inputVal)}
        disabled={isLoading}
        className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Tracing code...
          </span>
        ) : (
          'Animate Code →'
        )}
      </button>
    </div>
  );
}
