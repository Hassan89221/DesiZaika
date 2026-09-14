'use client';

import { useEffect, useRef, useState } from 'react';

export function useAnimatedCounter(
  target: number,
  duration = 2000,
  start = 0
) {
  const [value, setValue] = useState(start);
  const currentTargetRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === currentTargetRef.current) return;
    currentTargetRef.current = target;

    if (target === 0 && start === 0) {
      setValue(0);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (target - start) * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return value;
}
