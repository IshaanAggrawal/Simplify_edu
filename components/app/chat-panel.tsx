'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  currentCode: string;
  currentStepData: any;
}

// Generate a stable session ID that persists while the panel is mounted
function makeSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function ChatPanel({ currentCode, currentStepData }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null); // pro-gate / auth error
  const [sendError, setSendError] = useState<string | null>(null);   // transient send error
  const sessionIdRef = useRef<string>(makeSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSendError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          codeContext: currentCode,
          stepContext: JSON.stringify(currentStepData || {})
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setFatalError('AI Chat requires a Pro or Pro Max plan.');
          return;
        }
        if (response.status === 401) {
          setFatalError('Please sign in to use AI Chat.');
          return;
        }
        throw new Error(data.error || `Server error ${response.status}`);
      }

      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setSendError(err.message || 'Message failed. Please try again.');
      // Roll back the optimistic user message
      setMessages(prev => prev.slice(0, -1));
      setInput(text); // restore so user can retry
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, currentCode, currentStepData]);

  // Fatal gate — show upgrade prompt instead of the whole UI
  if (fatalError) {
    return (
      <div className="flex flex-col flex-1 min-h-[300px] items-center justify-center bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-md text-center p-8 gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">{fatalError}</p>
        <Button size="sm" onClick={() => window.location.href = '/pricing'}>
          Upgrade Plan →
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-[300px] bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-md shadow-sm">
      <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex justify-between items-center">
        <h3 className="font-semibold text-sm">AI Tutor</h3>
        <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded font-mono">Pro</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-[var(--color-text-muted)] mt-8 text-sm leading-relaxed">
            Ask me anything about the visualization!<br/>
            <span className="text-xs opacity-70">e.g. "Why did the pointer move here?" · "What's the time complexity?"</span>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-[var(--color-text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {sendError && (
          <div className="text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
            {sendError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-base)]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setSendError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
