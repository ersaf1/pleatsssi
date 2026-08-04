import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stories | CHARLES & KEITH Indonesia",
  description:
    "Editorial, tren, dan cerita di balik koleksi terbaru CHARLES & KEITH Indonesia.",
};

const STORIES = [
  {
    title: "Get Ready For Fall: Bags",
    category: "Editorial",
    date: "4 Agustus 2026",
    excerpt:
      "Musim baru, siluet baru. Dari top handle berstruktur hingga tas bahu yang slouchy, inilah tas-tas yang mendefinisikan gaya musim gugur tahun ini.",
    image: "/images/hero-desktop.png",
    href: "/id/bags",
    cta: "Belanja Tas",
    featured: true,
  },
  {
    title: "Shoes Collection",
    category: "Tren",
    date: "28 Juli 2026",
    excerpt:
      "Pumps pointed, loafers faux suede, dan flats slingback — langkah pertama menuju lemari sepatu musim ini dimulai di sini.",
    image: "/images/lifestyle-shoes.png",
    href: "/id/shoes",
    cta: "Belanja Sepatu",
    featured: false,
  },
  {
    title: "New This Week",
    category: "Baru Tiba",
    date: "21 Juli 2026",
    excerpt:
      "Sembilan gaya baru baru saja mendarat: tas knotted-belt, card holder quilted, dan charm playful yang siap melengkapi rotasi mingguanmu.",
    image: "/images/lifestyle-new.png",
    href: "/id/new-arrivals",
    cta: "Lihat Produk Baru",
    featured: false,
  },
];

export default function EditorialsPage() {
  const [featured, ...rest] = STORIES;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-12 xl:px-8">
      <h1 className="text-center text-xl font-bold uppercase tracking-[0.2em] md:text-2xl">
        Stories
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[13px] leading-relaxed text-gray-600">
        Editorial, tren, dan cerita di balik koleksi terbaru CHARLES &amp; KEITH.
      </p>

      {/* Featured story */}
      <article className="group relative mt-10 overflow-hidden">
        <Link href={featured.href} className="block">
          <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 to-transparent pb-10 text-center text-white">
            <p className="text-[11px] uppercase tracking-widest">{featured.category}</p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-widest md:text-3xl">
              {featured.title}
            </h2>
            <span className="mt-3 text-[13px] uppercase tracking-wider underline underline-offset-4">
              {featured.cta}
            </span>
          </div>
        </Link>
      </article>

      {/* Story grid */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {rest.map((story) => (
          <article key={story.title} className="group">
            <Link href={story.href} className="block">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="pt-4 text-center">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  {story.category} &middot; {story.date}
                </p>
                <h2 className="mt-2 text-[15px] font-bold uppercase tracking-widest">
                  {story.title}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-gray-600">
                  {story.excerpt}
                </p>
                <span className="mt-3 inline-block text-[13px] uppercase tracking-wider underline underline-offset-4">
                  {story.cta}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
