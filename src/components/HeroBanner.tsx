export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden border-b border-[#EADFD4] bg-[#FAF7F2]">
      <a href="#" className="block relative group">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
          <img
            src="/images/hero-mobile.png"
            alt="Get Ready For Fall: Bags"
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            fetchPriority="high"
          />
        </picture>

        {/* Warm cream editorial framing overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-12 md:left-12 max-w-md bg-[#FAF7F2]/95 backdrop-blur-md p-6 md:p-8 border border-[#EADFD4] shadow-lg rounded-sm">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#786E65] font-medium mb-2">
            Koleksi Terbaru
          </p>
          <h1 className="font-['Italiana',serif] text-2xl md:text-4xl text-[#1A1918] uppercase tracking-[0.15em] mb-4 leading-tight">
            Get Ready For Fall: Bags
          </h1>
          <span className="inline-flex items-center justify-center bg-[#0B4F3A] group-hover:bg-[#073628] text-[#FAF7F2] px-6 py-3 text-[12px] uppercase tracking-[0.2em] font-medium transition-colors rounded-sm shadow-sm">
            Belanja Sekarang
          </span>
        </div>
      </a>
    </section>
  );
}
