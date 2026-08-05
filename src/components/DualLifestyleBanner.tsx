interface Panel {
  image: string;
  category: string;
  subtitle?: string;
  cta: string;
  href: string;
}

const panels: Panel[] = [
  {
    image: "/images/lifestyle-shoes.png",
    category: "Shoes Collection",
    subtitle: "Koleksi Sepatu",
    cta: "Belanja Sekarang",
    href: "#",
  },
  {
    image: "/images/lifestyle-new.png",
    category: "New This Week",
    subtitle: "Rilisan Terbaru",
    cta: "Belanja Sekarang",
    href: "#",
  },
];

export function DualLifestyleBanner() {
  return (
    <section className="bg-[#FAF7F2] p-4 md:p-8 border-b border-[#EADFD4]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-[1920px] mx-auto">
        {panels.map((panel) => (
          <a
            key={panel.category}
            href={panel.href}
            className="relative block overflow-hidden group border border-[#EADFD4] rounded-sm bg-[#F5F0E6]"
          >
            <div className="overflow-hidden w-full">
              <img
                src={panel.image}
                alt={panel.category}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-[#FAF7F2]/95 backdrop-blur-md p-5 md:p-6 border border-[#EADFD4] shadow-md rounded-sm">
              {panel.subtitle && (
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#786E65] font-medium mb-1">
                  {panel.subtitle}
                </p>
              )}
              <h2 className="font-['Italiana',serif] text-xl md:text-2xl text-[#1A1918] uppercase tracking-[0.15em] font-normal mb-3">
                {panel.category}
              </h2>
              <span className="inline-flex items-center gap-2 text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-medium text-[#0B4F3A] group-hover:text-[#073628] transition-colors border-b border-[#0B4F3A]/40 pb-0.5">
                {panel.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
