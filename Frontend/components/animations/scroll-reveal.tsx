'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

const directionMap: Record<Direction, string> = {
  up: 'translate-y-8 opacity-0',
  down: '-translate-y-8 opacity-0',
  left: 'translate-x-8 opacity-0',
  right: '-translate-x-8 opacity-0',
  scale: 'scale-95 opacity-0',
  none: 'opacity-0',
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as React.Ref<any>}
      className={cn(
        'transition-all ease-out will-change-transform',
        isVisible ? 'translate-x-0 translate-y-0 scale-100 opacity-100' : directionMap[direction],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
