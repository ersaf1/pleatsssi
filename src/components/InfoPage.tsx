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
  return (
    <div className="w-full bg-[#FAF7F2]/40 py-8 px-4 md:py-16">
      <div className="mx-auto w-full max-w-4xl rounded-sm border border-[#EADFD4] bg-[#FAF7F2] p-6 md:p-12 shadow-sm">
        <h1 className="font-['Italiana',serif] text-center text-2xl font-normal uppercase tracking-[0.2em] text-[#1A1918] md:text-3xl">
          {content.title}
        </h1>
        {content.intro && (
          <p className="mt-4 text-center text-[13px] md:text-sm leading-relaxed text-[#786E65]">
            {content.intro}
          </p>
        )}
        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section key={section.heading} className="border-b border-[#EADFD4]/60 pb-6 last:border-0 last:pb-0">
              <h2 className="font-['Italiana',serif] text-lg font-semibold uppercase tracking-[0.15em] text-[#1A1918]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-[13px] md:text-[14px] leading-relaxed text-[#5A524A]">
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

