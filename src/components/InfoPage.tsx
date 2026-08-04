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
    <div className="mx-auto w-full max-w-3xl px-4 py-12 xl:px-0">
      <h1 className="text-center text-xl font-bold uppercase tracking-[0.2em] md:text-2xl">
        {content.title}
      </h1>
      {content.intro && (
        <p className="mt-4 text-center text-[13px] leading-relaxed text-gray-600">
          {content.intro}
        </p>
      )}
      <div className="mt-10 space-y-8">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[14px] font-bold uppercase tracking-wider">{section.heading}</h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[13px] leading-relaxed text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
