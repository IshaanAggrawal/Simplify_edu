'use client';

import { useState } from 'react';
import { Button } from '../ui/button';

export function BugReportPanel() {
  const [type, setType] = useState<'bug' | 'feature' | 'general'>('bug');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setStatus('success');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col flex-1 min-h-[300px] bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-md shadow-sm items-center justify-center p-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Thank you!</h3>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
          Your feedback has been received. We appreciate your help in making AlgoViz better for everyone!
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setStatus('idle')}>
          Submit Another Report
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-[300px] bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-md shadow-sm">
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex justify-between items-center">
        <h3 className="font-semibold text-sm">Feedback & Bug Reports</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Found a bug with the visualization? Have a great idea for a new feature? We want to hear about it.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Type of Feedback</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                  type === 'bug' 
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                🐞 Report a Bug
              </button>
              <button
                type="button"
                onClick={() => setType('feature')}
                className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                  type === 'feature' 
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]' 
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                ✨ Feature Request
              </button>
              <button
                type="button"
                onClick={() => setType('general')}
                className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                  type === 'general' 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                }`}
              >
                💬 General
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">Your Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === 'bug' ? "What went wrong? e.g. 'The pointer jumps to the wrong node on step 3...'" :
                type === 'feature' ? "What should we build next? e.g. 'Please add topological sort to the patterns...'" :
                "Any other thoughts or suggestions?"
              }
              className="min-h-[120px] bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-y"
              disabled={status === 'loading'}
            />
          </div>

          {status === 'error' && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded p-3">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
            <Button 
              type="submit" 
              disabled={status === 'loading' || !message.trim()}
              className="px-6"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
