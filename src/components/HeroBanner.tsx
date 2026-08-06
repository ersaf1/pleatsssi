import Image from 'next/image';

export interface HeroBannerData {
  imageDesktop: string;
  imageMobile: string;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

interface HeroBannerProps {
  data?: HeroBannerData;
}

const FALLBACK: HeroBannerData = {
  imageDesktop: '/images/hero-desktop.png',
  imageMobile: '/images/hero-mobile.png',
  title: 'Koleksi Terbaru PLEATSSSI',
  subtitle: 'Koleksi Terbaru',
  ctaLabel: 'Belanja Sekarang',
  ctaUrl: '/id/new-arrivals',
};

export function HeroBanner({ data = FALLBACK }: HeroBannerProps) {
  const href = data.ctaUrl || '#';
  return (
    <section className="relative w-full overflow-hidden border-b border-[#EADFD4] bg-[#FAF7F2]">
      <a href={href} className="block relative group">
        <picture>
          <source media="(min-width: 768px)" srcSet={data.imageDesktop} />
          <Image
            src={data.imageMobile || data.imageDesktop}
            alt={data.title}
            width={1920}
            height={1080}
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
          />
        </picture>

        {/* Warm cream editorial framing overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-12 md:left-12 max-w-md bg-[#FAF7F2]/95 backdrop-blur-md p-6 md:p-8 border border-[#EADFD4] shadow-lg rounded-sm">
          {data.subtitle && (
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#786E65] font-medium mb-2">
              {data.subtitle}
            </p>
          )}
          <h1 className="font-['Italiana',serif] text-2xl md:text-4xl text-[#1A1918] uppercase tracking-[0.15em] mb-4 leading-tight">
            {data.title}
          </h1>
          {data.ctaLabel && (
            <span className="inline-flex items-center justify-center bg-[#0B4F3A] group-hover:bg-[#073628] text-[#FAF7F2] px-6 py-3 text-[12px] uppercase tracking-[0.2em] font-medium transition-colors rounded-sm shadow-sm">
              {data.ctaLabel}
            </span>
          )}
        </div>
      </a>
    </section>
  );
}
