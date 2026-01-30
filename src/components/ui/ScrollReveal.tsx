'use client';

import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type ScrollRevealProps<T extends ElementType = 'div'> = {
  /** Content to animate */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional delay in seconds for stagger effect */
  delay?: number;
  /** HTML element type to render. Default: 'div' */
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'className' | 'style'>;

/**
 * Wrapper component for scroll-triggered fade-in-up animations.
 * Respects prefers-reduced-motion accessibility setting.
 *
 * @example
 * ```tsx
 * <ScrollReveal>
 *   <Card>Content</Card>
 * </ScrollReveal>
 *
 * // With stagger delay
 * {items.map((item, i) => (
 *   <ScrollReveal key={item.id} delay={i * 0.1}>
 *     <Card>{item.title}</Card>
 *   </ScrollReveal>
 * ))}
 *
 * // With custom element type
 * <ScrollReveal as="section">
 *   <h2>Section Title</h2>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal<T extends ElementType = 'div'>({
  children,
  className = '',
  delay,
  as,
  ...rest
}: ScrollRevealProps<T>) {
  const { ref, isVisible } = useScrollAnimation();
  const Component = as || 'div';

  const delayStyle = delay !== undefined ? { transitionDelay: `${delay}s` } : undefined;

  return (
    <Component
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={delayStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}
