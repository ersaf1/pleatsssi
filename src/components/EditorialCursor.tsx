'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * EditorialCursor — replaces default cursor with a soft glow orb + trailing dot.
 * The glow follows lazily (spring), the dot follows instantly.
 * Both disappear on touch devices.
 */
export function EditorialCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);

  useEffect(() => {
    // Only run on pointer-capable devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;

    // Show cursors
    gsap.set([glow, dot], { opacity: 0, scale: 0 });

    let mx = -200, my = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Dot snaps instantly
      gsap.set(dot, { x: mx, y: my });

      // Glow springs behind with lag
      gsap.to(glow, {
        x: mx,
        y: my,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      if (!isActive.current) {
        isActive.current = true;
        gsap.to([glow, dot], { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
      }
    };

    const onLeave = () => {
      isActive.current = false;
      gsap.to([glow, dot], { opacity: 0, scale: 0.4, duration: 0.4, ease: 'power2.in' });
    };

    const onEnterLink = () => {
      gsap.to(glow, { scale: 2.2, opacity: 0.55, duration: 0.35, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.3, duration: 0.25, ease: 'power2.out' });
    };

    const onLeaveLink = () => {
      gsap.to(glow, { scale: 1, opacity: 0.85, duration: 0.35, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' });
    };

    const onMouseDown = () => {
      gsap.to(glow, { scale: 0.8, duration: 0.15, ease: 'power3.in' });
    };

    const onMouseUp = () => {
      gsap.to(glow, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Attach link/button hover via delegation
    const onEnterInteractive = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) onEnterLink();
    };
    const onLeaveInteractive = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"]')) onLeaveLink();
    };

    document.addEventListener('mouseover', onEnterInteractive);
    document.addEventListener('mouseout', onLeaveInteractive);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onEnterInteractive);
      document.removeEventListener('mouseout', onLeaveInteractive);
    };
  }, []);

  return (
    <>
      {/* Soft glow orb — lags behind */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,79,58,0.22) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
      {/* Crisp dot — snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#0B4F3A',
        }}
      />
    </>
  );
}
