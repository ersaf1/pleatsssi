/**
 * GSAP singleton setup
 * Import this module once (in layout) to register plugins globally.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Default ease curve for PLEATSSSI — silky editorial feel */
export const EASE_EDITORIAL = 'power3.out';
export const EASE_BOUNCE_SOFT = 'back.out(1.2)';
export const EASE_SMOOTH = 'power2.inOut';

/** Stagger config for grid/list reveals */
export const STAGGER_DEFAULT = {
  each: 0.08,
  from: 'start' as const,
  ease: 'power2.out',
};
