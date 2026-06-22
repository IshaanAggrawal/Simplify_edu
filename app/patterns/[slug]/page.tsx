'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '../../../components/ui/navbar';
import { Footer } from '../../../components/ui/footer';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { VisualizationCanvas } from '../../../components/visualizer/visualization-canvas';
import { PlaybackControls } from '../../../components/visualizer/playback-controls';
import { StepDescription } from '../../../components/visualizer/step-description';
import { usePlayback } from '../../../hooks/use-playback';
import { PATTERNS } from '../../../data/patterns';

export default function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const pattern = PATTERNS[slug];
  
  if (!pattern) return notFound();

  const { 
    currentStep, isPlaying, speed,
    play, pause, next, prev, setSpeed 
  } = usePlayback(pattern.steps.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] mb-4">
            <Link href="/patterns" className="hover:text-[var(--color-text-primary)]">Patterns</Link>
            <span>/</span>
            <span>{pattern.category}</span>
            <span>/</span>
            <span className="text-[var(--color-text-primary)]">{pattern.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">{pattern.name}</h1>
            <Link href="/app">
              <Button>Try with your code &rarr;</Button>
            </Link>
          </div>
          <div className="flex space-x-3 mt-4">
            <Badge variant="outline">Pattern: {pattern.pattern}</Badge>
            <Badge variant="outline">O({pattern.time_complexity}) Time</Badge>
            <Badge variant="outline">O({pattern.space_complexity}) Space</Badge>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Visualizer Column */}
          <div className="lg:col-span-2 flex flex-col rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm">
            <VisualizationCanvas 
              stepData={pattern.steps[currentStep]} 
              layoutType={pattern.category === 'Trees' ? 'tree' : 'list'} 
            />
            <PlaybackControls 
              currentStep={currentStep}
              totalSteps={pattern.steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onPlay={play}
              onPause={pause}
              onNext={next}
              onPrev={prev}
              onSpeedChange={setSpeed}
            />
            <StepDescription stepData={pattern.steps[currentStep]} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">When to use</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)] mb-6">
                {pattern.when_to_use}
              </p>
              
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Key Insight</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                {pattern.pattern_explanation}
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">C++ Template</h3>
              <div className="bg-[var(--color-bg-elevated)] rounded-md p-4 overflow-x-auto border border-[var(--color-border)]">
                <pre className="font-mono text-xs leading-relaxed text-[var(--color-text-primary)]">
                  <code>{pattern.languages.cpp}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
