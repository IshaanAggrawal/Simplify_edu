import { useState, useEffect } from 'react';
import { VisualizationStep } from '../lib/types/visualization';

export interface TraceHistoryItem {
  id: string;
  timestamp: number;
  code: string;
  input: string;
  language: string;
  steps: VisualizationStep[];
}

const MAX_HISTORY = 5;

export function useTraceHistory() {
  const [history, setHistory] = useState<TraceHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('algoviz_trace_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  const saveTrace = (code: string, input: string, language: string, steps: VisualizationStep[]) => {
    const newItem: TraceHistoryItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      code,
      input,
      language,
      steps,
    };

    setHistory(prev => {
      // Add new item to front, keep only MAX_HISTORY
      const newHistory = [newItem, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem('algoviz_trace_history', JSON.stringify(newHistory));
      } catch (err) {
        console.error('Failed to save history:', err);
      }
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('algoviz_trace_history');
  };

  return { history, saveTrace, clearHistory };
}
