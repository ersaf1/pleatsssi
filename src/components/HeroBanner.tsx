export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <a href="#" className="block">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/hero-desktop.png" />
          <img
            src="/images/hero-mobile.png"
            alt="Get Ready For Fall: Bags"
            className="w-full h-auto"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute bottom-8 left-6 md:bottom-12 md:left-10">
          <h1 className="text-white font-semibold text-xl md:text-3xl uppercase mb-2 tracking-wide">
            Get Ready For Fall: Bags
          </h1>
          <p className="text-white text-[15px] underline tracking-wide">Belanja Sekarang</p>
        </div>
      </a>
    </section>
  );
};

