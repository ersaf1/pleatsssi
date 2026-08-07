'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export interface InfoSection {
  heading: string;
  paragraphs: string[];
}

export interface InfoPageContent {
  title: string;
  intro?: string;
  sections: InfoSection[];
}

interface InfoPageProps {
  content: InfoPageContent;
}

export function InfoPage({ content }: InfoPageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Card glides up with subtle shadow grow
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 48, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75 }
      )
        // Title letterSpacing open
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 20, letterSpacing: '0.5em' },
          { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.6 },
          '-=0.4'
        )
        // Intro fade
        .fromTo(
          introRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        );

      // Each section stagger-reveals on scroll
      const sections = wrapRef.current
        ? Array.from(wrapRef.current.querySelectorAll<HTMLElement>('[data-info-section]'))
        : [];

      sections.forEach((section, i) => {
        const heading = section.querySelector('h2');
        const paras = Array.from(section.querySelectorAll('p'));

        gsap.fromTo(
          heading,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: 'power3.out',
            delay: i * 0.04,
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              once: true,
            } satisfies ScrollTrigger.Vars,
          }
        );

        gsap.fromTo(
          paras,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            delay: i * 0.04 + 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              once: true,
            } satisfies ScrollTrigger.Vars,
          }
        );
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="w-full bg-[#FAF7F2]/40 py-8 px-4 md:py-16">
      <div
        ref={cardRef}
        className="mx-auto w-full max-w-4xl rounded-sm border border-[#EADFD4] bg-[#FAF7F2] p-6 md:p-12 shadow-sm"
      >
        <h1
          ref={titleRef}
          className="font-['Italiana',serif] text-center text-2xl font-normal uppercase tracking-[0.2em] text-[#1A1918] md:text-3xl"
        >
          {content.title}
        </h1>

        {content.intro && (
          <p
            ref={introRef}
            className="mt-4 text-center text-[13px] md:text-sm leading-relaxed text-[#786E65]"
          >
            {content.intro}
          </p>
        )}

        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section
              key={section.heading}
              data-info-section
              className="border-b border-[#EADFD4]/60 pb-6 last:border-0 last:pb-0"
            >
              <h2 className="font-['Italiana',serif] text-lg font-semibold uppercase tracking-[0.15em] text-[#1A1918]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[13px] md:text-[14px] leading-relaxed text-[#5A524A]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
