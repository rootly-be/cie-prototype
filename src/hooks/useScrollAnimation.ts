'use client';

import { useRef, useEffect, useState } from 'react';

interface UseScrollAnimationOptions {
  /** IntersectionObserver rootMargin. Default: '0px 0px -50px 0px' (triggers before fully visible) */
  rootMargin?: string;
  /** IntersectionObserver threshold. Default: 0.1 */
  threshold?: number;
  /** If true, animation only triggers once. Default: true */
  triggerOnce?: boolean;
}

interface UseScrollAnimationReturn {
  /** Ref to attach to the animated element */
  ref: React.RefObject<HTMLDivElement | null>;
  /** Whether the element is currently visible */
  isVisible: boolean;
}

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 * Respects prefers-reduced-motion accessibility setting.
 *
 * Note: Each hook instance creates its own IntersectionObserver. For pages with
 * many animated elements, consider a shared observer pattern as a future optimization.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, isVisible } = useScrollAnimation();
 *   return (
 *     <div ref={ref} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''}`}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
  const {
    rootMargin = '0px 0px -50px 0px',
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference - if enabled, show immediately
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isVisible };
}
