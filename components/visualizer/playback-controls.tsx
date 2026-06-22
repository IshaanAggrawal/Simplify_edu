import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../ui/button';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSpeedChange
}: PlaybackControlsProps) {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrev} 
          disabled={currentStep === 0}
          title="Previous Step (Left Arrow)"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button variant="primary" size="sm" onClick={onPause} title="Pause (Space)">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onPlay} disabled={currentStep >= totalSteps - 1} title="Play (Space)">
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNext} 
          disabled={currentStep >= totalSteps - 1}
          title="Next Step (Right Arrow)"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm font-medium text-[var(--color-text-secondary)] font-mono">
        Step {currentStep + 1} / {totalSteps || 1}
      </div>

      <div className="flex items-center space-x-1">
        <span className="text-xs text-[var(--color-text-muted)] mr-2">Speed:</span>
        {speeds.map(s => (
          <Button
            key={s}
            variant={speed === s ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => onSpeedChange(s)}
            className="h-7 px-2 text-xs"
          >
            {s}x
          </Button>
        ))}
      </div>
    </div>
  );
}
