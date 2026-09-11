'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties } from 'react';

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  className,
  staggerDelay = 100,
}: StaggerGridProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {items.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all ease-out will-change-transform',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
          style={{
            transitionDuration: '600ms',
            transitionDelay: `${isVisible ? index * staggerDelay : 0}ms`,
          } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
