'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface ScrollRevealOptions {
  /** y translation to start from (px). Default 48 */
  fromY?: number;
  /** x translation to start from (px). Default 0 */
  fromX?: number;
  /** opacity start. Default 0 */
  fromOpacity?: number;
  /** scale start. Default 1 */
  fromScale?: number;
  /** duration in seconds. Default 0.85 */
  duration?: number;
  /** ease. Default 'power3.out' */
  ease?: string;
  /** ScrollTrigger start offset. Default 'top 88%' */
  start?: string;
  /** stagger for child elements */
  stagger?: number;
  /** css selector for stagger children */
  staggerSelector?: string;
  /** delay before animation. Default 0 */
  delay?: number;
}

/**
 * Attach a GSAP scroll-reveal to the returned ref.
 * The container fades + slides in when it enters the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    fromY = 48,
    fromX = 0,
    fromOpacity = 0,
    fromScale = 1,
    duration = 0.85,
    ease = 'power3.out',
    start = 'top 88%',
    stagger,
    staggerSelector,
    delay = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = staggerSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(staggerSelector))
      : el;

    const from: gsap.TweenVars = {
      y: fromY,
      x: fromX,
      opacity: fromOpacity,
      scale: fromScale,
    };

    const to: gsap.TweenVars = {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      ease,
      delay,
      ...(stagger !== undefined && { stagger }),
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        once: true,
      } satisfies ScrollTrigger.Vars,
    };

    gsap.fromTo(targets, from, to);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, duration, ease, fromOpacity, fromScale, fromX, fromY, stagger, staggerSelector, start]);

  return ref;
}
