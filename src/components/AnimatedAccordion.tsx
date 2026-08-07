'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { Minus, Plus } from 'lucide-react';

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AnimatedAccordionProps {
  sections: AccordionItem[];
  /** Index of initially open section. Default 0 */
  defaultOpen?: number | null;
}

interface PanelProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionPanel({ item, isOpen, onToggle }: PanelProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    if (isAnimating.current) return;
    isAnimating.current = true;

    if (isOpen) {
      // Measure natural height
      gsap.set(body, { height: 0, opacity: 1, overflow: 'hidden' });
      const targetH = inner.scrollHeight;

      gsap.to(body, {
        height: targetH,
        duration: 0.42,
        ease: 'power3.out',
        onComplete: () => {
          // Let height be auto so it reflows naturally
          gsap.set(body, { height: 'auto', overflow: 'visible' });
          isAnimating.current = false;
        },
      });

      // Icon rotates from + to −
      gsap.to(iconRef.current, {
        rotate: 45,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      const currentH = body.offsetHeight;
      gsap.set(body, { height: currentH, overflow: 'hidden' });

      gsap.to(body, {
        height: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      // Icon rotates back
      gsap.to(iconRef.current, {
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[#EADFD4]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left font-['Italiana',serif] text-sm font-semibold uppercase tracking-[0.15em] text-[#1A1918] transition-colors hover:text-[#0B4F3A]"
      >
        <span>{item.title}</span>
        {/* Single icon that morphs via rotation */}
        <span
          ref={iconRef}
          className="flex-shrink-0 text-[#786E65] transition-colors"
          style={{ display: 'inline-flex' }}
        >
          {isOpen
            ? <Minus size={16} strokeWidth={1.5} className="text-[#0B4F3A]" />
            : <Plus size={16} strokeWidth={1.5} />
          }
        </span>
      </button>

      {/* Animated body */}
      <div ref={bodyRef} style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden', opacity: 1 }}>
        <div ref={innerRef} className="pb-5 text-[13px] leading-relaxed text-[#5A524A]">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export function AnimatedAccordion({ sections, defaultOpen = 0 }: AnimatedAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="mt-8 border-t border-[#EADFD4]">
      {sections.map((item, index) => (
        <AccordionPanel
          key={item.title}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

