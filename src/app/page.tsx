import { Header } from '@/components/Header';
import { HeroBanner, type HeroBannerData } from '@/components/HeroBanner';
import { DualLifestyleBanner, type LifestylePanel } from '@/components/DualLifestyleBanner';
import { Footer } from '@/components/Footer';
import { getDynamicBanners } from '@/lib/services/bannerService';

async function getHeroData(): Promise<HeroBannerData | undefined> {
  try {
    const banners = await getDynamicBanners('hero');
    const active = banners.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
    if (!active.length) return undefined;
    const b = active[0];
    return {
      imageDesktop: b.image_url_desktop,
      imageMobile: b.image_url_mobile || b.image_url_desktop,
      title: b.title || 'Koleksi Terbaru PLEATSSSI',
      subtitle: b.subtitle,
      ctaLabel: b.cta_label,
      ctaUrl: b.cta_url,
    };
  } catch {
    return undefined;
  }
}

async function getLifestylePanels(): Promise<LifestylePanel[] | undefined> {
  try {
    const banners = await getDynamicBanners('lifestyle');
    const active = banners.filter((b) => b.is_active).sort((a, b) => a.sort_order - b.sort_order);
    if (!active.length) return undefined;
    return active.map((b) => ({
      image: b.image_url_desktop,
      category: b.title || 'Koleksi',
      subtitle: b.subtitle,
      cta: b.cta_label || 'Belanja Sekarang',
      href: b.cta_url || '#',
    }));
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const [heroData, lifestylePanels] = await Promise.all([
    getHeroData(),
    getLifestylePanels(),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroBanner data={heroData} />
        <DualLifestyleBanner panels={lifestylePanels} />
      </main>
      <Footer />
    </>
  );
}
