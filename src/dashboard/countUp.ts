import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setCurrent(target);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || duration <= 0) {
      setCurrent(target);
      return;
    }

    let animationFrameId: number;
    const startTime = performance.now();
    const startValue = startRef.current;
    const diff = target - startValue;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + diff * easeProgress);

      setCurrent(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        startRef.current = target;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return current;
}
