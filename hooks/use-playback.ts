import { useState, useEffect, useCallback } from 'react';

export function usePlayback(totalSteps: number, defaultSpeed: number = 1) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(p => !p), []);
  
  const next = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);
  
  const prev = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0));
  }, []);
  
  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  // Handle auto-playback
  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
      return;
    }

    const baseDelay = 1500; // 1.5 seconds per step at 1x speed
    const delay = baseDelay / speed;
    
    const timer = setTimeout(() => {
      next();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, speed, next]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        toggle();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        pause();
        next();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        pause();
        prev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, next, prev, pause]);

  // Reset when total steps change (e.g. new code is traced)
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [totalSteps]);

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    next,
    prev,
    goToStep,
    setSpeed
  };
}
