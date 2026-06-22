'use client';

import { useState } from 'react';
import { Navbar } from '../../components/ui/navbar';
import { CodeEditor } from '../../components/app/code-editor';
import { InputPanel } from '../../components/app/input-panel';
import { VisualizationCanvas } from '../../components/visualizer/visualization-canvas';
import { PlaybackControls } from '../../components/visualizer/playback-controls';
import { StepDescription } from '../../components/visualizer/step-description';
import { usePlayback } from '../../hooks/use-playback';
import { useTraceHistory } from '../../hooks/use-trace-history';
import { VisualizationStep } from '../../lib/types/visualization';
import { ChatPanel } from '../../components/app/chat-panel';
import { BugReportPanel } from '../../components/app/bug-report-panel';

export default function AppOverviewPage() {
  const [code, setCode] = useState('// Paste your code here\n// We will trace it step by step\n');
  const [input, setInput] = useState('[]');
  const [language, setLanguage] = useState('cpp');
  const [isTracing, setIsTracing] = useState(false);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [activeTab, setActiveTab] = useState<'animation' | 'chat' | 'bug'>('animation');

  const { history, saveTrace } = useTraceHistory();

  const { 
    currentStep, isPlaying, speed,
    play, pause, next, prev, setSpeed, goToStep
  } = usePlayback(steps.length);

  const handleAnimate = async (input: string) => {
    setIsTracing(true);
    setError(null);
    setLimitReached(false);
    pause();

    try {
      const res = await fetch('/api/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input, language })
      });

      const data = await res.json();

      if (res.status === 429) {
        setLimitReached(true);
        setError(data.error || 'Daily limit reached.');
        setSteps([]);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || `Failed to trace: ${res.statusText}`);
      }

      if (data.error) throw new Error(data.error);

      setSteps(data.steps || []);
      goToStep(0);
      saveTrace(code, input, language, data.steps || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while tracing.');
      setSteps([]);
    } finally {
      setIsTracing(false);
    }
  };

  const loadHistoryItem = (item: any) => {
    setCode(item.code);
    setLanguage(item.language);
    setSteps(item.steps);
    goToStep(0);
    pause();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel: Editor & Input */}
        <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Code</h2>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded px-2 py-1 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          
          <CodeEditor 
            code={code} 
            language={language} 
            onChange={(val) => setCode(val || '')} 
            highlightLine={steps[currentStep]?.code_line ? 1 : undefined} // Mock for highlight logic
          />
          
          <InputPanel onAnimate={handleAnimate} isLoading={isTracing} />
          
          {isTracing && (
            <div className="mt-2 text-xs text-center text-[var(--color-text-muted)] animate-pulse">
              AI is analyzing every pointer... (This may take 30-60 seconds for complex loops)
            </div>
          )}
          
          {error && !limitReached && (
            <div className="mt-4 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 text-[var(--color-error)] rounded text-sm">
              <span className="font-semibold">Trace failed:</span> {error}
            </div>
          )}

          {limitReached && (
            <div className="mt-4 p-4 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/30 rounded-lg text-sm text-center">
              <div className="font-semibold text-[var(--color-text-primary)] mb-1">Daily limit reached 🚀</div>
              <div className="text-[var(--color-text-secondary)] mb-3 text-xs">{error}</div>
              <a href="/pricing" className="inline-block bg-[var(--color-accent)] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[var(--color-accent-hover)] transition-colors">
                Upgrade Plan →
              </a>
            </div>
          )}

          {/* History Panel */}
          {history.length > 0 && (
            <div className="mt-6 border-t border-[var(--color-border)] pt-4">
              <h3 className="text-sm font-semibold tracking-tight text-[var(--color-text-secondary)] mb-3">Recent Traces (Last {history.length})</h3>
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left text-xs bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-elevated)] transition-colors p-2 rounded-md flex justify-between items-center"
                  >
                    <span className="truncate flex-1 max-w-[200px] font-mono text-[var(--color-text-primary)]">
                      {item.language}: {item.code.substring(0, 20).replace(/\n/g, '')}...
                    </span>
                    <span className="text-[var(--color-text-muted)] flex-shrink-0 ml-2">
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Visualization & Tabs */}
        <div className="flex-1 flex flex-col min-w-0">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Execution Trace</h2>
          
          <div className="flex-1 flex flex-col bg-[var(--color-bg-surface)] rounded-md border border-[var(--color-border)] overflow-hidden shadow-sm">
            {steps.length > 0 ? (
              <>
                <VisualizationCanvas stepData={steps[currentStep]} />
                <PlaybackControls 
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  isPlaying={isPlaying}
                  speed={speed}
                  onPlay={play}
                  onPause={pause}
                  onNext={next}
                  onPrev={prev}
                  onSpeedChange={setSpeed}
                />
                <StepDescription stepData={steps[currentStep]} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--color-text-muted)] min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--color-text-secondary)] mb-2">No Visualization Yet</h3>
                <p className="max-w-md text-sm">Paste your code on the left, provide some input data, and click "Animate Code" to see the trace execution.</p>
              </div>
            )}
          </div>
          
          {/* Tab Bar */}
          <div className="mt-4 flex border-b border-[var(--color-border)]">
            <button 
              onClick={() => setActiveTab('animation')}
              className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'animation' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
            >
              Animation
            </button>
            <button 
              onClick={() => setActiveTab('bug')}
              className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'bug' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
            >
              Bug Report
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
            >
              AI Chat
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-accent)]/20 text-[var(--color-accent)]">PRO</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            {activeTab === 'chat' && (
              <ChatPanel currentCode={code} currentStepData={steps[currentStep]} />
            )}
            {activeTab === 'bug' && (
              <BugReportPanel />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
