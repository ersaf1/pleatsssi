"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedAccordion, type AccordionItem } from "./AnimatedAccordion";
import type { CategorySlug, Product } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { ProductCarousel } from "./ProductCarousel";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SIZE_OPTIONS: Record<CategorySlug, string[]> = {
  skirts: ["S", "M", "L", "XL"],
  tops: ["S", "M", "L", "XL"],
  pants: ["S", "M", "L", "XL"],
  others: ["ONE SIZE"],
};

const EDITORS_NOTE: Record<CategorySlug, string> = {
  skirts: "dipotong dengan detail yang cermat untuk jatuh indah di setiap gerakan. Siluetnya yang modern menjadikannya pilihan sempurna dari pagi hingga malam.",
  tops: "dirancang untuk kenyamanan sepanjang hari, menghadirkan keseimbangan antara gaya kasual dan sentuhan kontemporer yang mudah dipadukan dengan berbagai busana.",
  pants: "menawarkan potongan yang nyaman dengan siluet stylish — teman setia untuk tampilan santai maupun formal.",
  others: "menghadirkan detail menarik yang melengkapi koleksi — pilihan sempurna untuk memperkaya tampilanmu.",
};

const PRODUCT_DETAILS: Record<CategorySlug, string[]> = {
  skirts: [
    "Bahan: Katun premium yang nyaman",
    "Detail lipit dengan hasil jahitan rapi",
    "Tersedia dalam berbagai ukuran: S, M, L, XL",
    "Ritsleting tersembunyi di bagian belakang",
  ],
  tops: [
    "Bahan: Katun adem dan menyerap keringat",
    "Potongan longgar yang nyaman dipakai seharian",
    "Tersedia dalam berbagai ukuran: S, M, L, XL",
    "Jahitan rapi dengan detail modern",
  ],
  pants: [
    "Bahan: Katun premium dengan tekstur nyaman",
    "Potongan high-waist dengan tali yang dapat disesuaikan",
    "Tersedia dalam berbagai ukuran: S, M, L, XL",
    "Saku samping fungsional",
  ],
  others: [
    "Bahan: Katun premium yang nyaman",
    "Detail jahitan rapi dengan finishing halus",
    "Dikemas dalam kemasan khas PLEATSSSI",
  ],
};

const CARE_INSTRUCTIONS = [
  "Simpan di dalam dust bag saat tidak digunakan",
  "Jauhkan dari air, parfum, dan paparan panas berlebih",
  "Bersihkan dengan lembut menggunakan kain kering yang lembut",
];

const SHIPPING_RETURNS = [
  "Gratis pengiriman untuk area JABODETABEK.",
  "Estimasi pengiriman: 2-5 hari kerja (Pulau Jawa) dan 5-10 hari kerja (luar Pulau Jawa).",
  "Bea cukai & pajak sudah termasuk dalam harga — tidak ada biaya tersembunyi saat pembayaran.",
  "Pengembalian mudah dalam waktu 30 hari sejak tanggal penerimaan, selama produk belum digunakan dan label masih terpasang.",
];

interface ProductDetailProps {
  product: Product;
  variants: Product[];
  relatedProducts: Product[];
  pairingProducts: Product[];
}

export function ProductDetail({
  product,
  variants,
  relatedProducts,
  pairingProducts,
}: ProductDetailProps) {
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const sizes = SIZE_OPTIONS[product.category] || SIZE_OPTIONS.others;
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [addingPulse, setAddingPulse] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isTrending = product.collections?.includes("trending-now");
  const hasVariants = variants.length > 1;

  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mainImgRef = useRef<HTMLDivElement>(null);
  const categorySectionRef = useRef<HTMLElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  /* ── Mount entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl
        .fromTo(
          galleryRef.current,
          { opacity: 0, x: -56, filter: "blur(8px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9 }
        )
        .fromTo(
          infoRef.current,
          { opacity: 0, x: 56, filter: "blur(8px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.7"
        );

      const pills = categorySectionRef.current
        ? Array.from(categorySectionRef.current.querySelectorAll("a"))
        : [];
      if (pills.length) {
        gsap.fromTo(
          pills,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.45, ease: "back.out(1.3)", stagger: 0.06,
            scrollTrigger: {
              trigger: categorySectionRef.current,
              start: "top 88%",
              once: true,
            } satisfies ScrollTrigger.Vars,
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── Gallery image crossfade ── */
  const handleThumbnailClick = useCallback((index: number) => {
    if (index === activeImage) return;
    const img = mainImgRef.current;
    if (!img) { setActiveImage(index); return; }
    gsap.to(img, {
      opacity: 0, scale: 1.03, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveImage(index);
        gsap.fromTo(img, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" });
      },
    });
  }, [activeImage]);

  const handlePrevImage = () => handleThumbnailClick((activeImage - 1 + gallery.length) % gallery.length);
  const handleNextImage = () => handleThumbnailClick((activeImage + 1) % gallery.length);

  /* ── Add to bag ── */
  function handleAddToBag() {
    const numericPrice = parseInt(product.price.replace(/[^\d]/g, ""), 10) || 0;
    addItem({
      variantId: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      variantLabel: [product.color, selectedSize].filter(Boolean).join(" / "),
      price: numericPrice,
      quantity: 1,
      stockAvailable: 10,
      imageUrl: product.image,
    });
    setAdded(true);
    setAddingPulse(true);
    if (addBtnRef.current) {
      gsap.timeline()
        .to(addBtnRef.current, { scale: 0.96, duration: 0.1, ease: "power2.in" })
        .to(addBtnRef.current, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    }
    window.setTimeout(() => { setAdded(false); setAddingPulse(false); }, 2200);
  }

  const editorsNote = EDITORS_NOTE[product.category] || EDITORS_NOTE.others;
  const productDetails = PRODUCT_DETAILS[product.category] || PRODUCT_DETAILS.others;
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  const accordionSections: AccordionItem[] = [
    {
      title: "Editor's Note",
      content: (
        <p className="text-[13px] text-[#5A524A] leading-relaxed">
          <span className="font-semibold text-[#1A1918]">{product.name}</span> {editorsNote}
        </p>
      ),
    },
    {
      title: "Detail Produk & Instruksi Perawatan",
      content: (
        <div className="space-y-4 text-[13px] text-[#5A524A]">
          <ul className="list-disc space-y-1.5 pl-5">
            {productDetails.map((item) => (<li key={item}>{item}</li>))}
          </ul>
          <div>
            <p className="mb-1.5 font-semibold text-[#1A1918]">Instruksi Perawatan</p>
            <ul className="list-disc space-y-1.5 pl-5">
              {CARE_INSTRUCTIONS.map((item) => (<li key={item}>{item}</li>))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Pengiriman & Pengembalian",
      content: (
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-[#5A524A]">
          {SHIPPING_RETURNS.map((item) => (<li key={item}>{item}</li>))}
        </ul>
      ),
    },
  ];

  const relatedCategories = (Object.keys(CATEGORY_LABELS) as CategorySlug[]).filter(
    (slug) => slug !== product.category
  );

  return (
    <div className="bg-[#FAF7F2] pb-16">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 xl:px-8">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="text-[11px] text-[#786E65] flex items-center gap-2">
          <Link href="/" className="hover:text-[#0B4F3A] transition-colors">Beranda</Link>
          <span className="text-[#D4C9B8]">/</span>
          <Link href={`/id/${product.category}`} className="hover:text-[#0B4F3A] transition-colors">{categoryLabel}</Link>
          <span className="text-[#D4C9B8]">/</span>
          <span className="font-medium text-[#1A1918] truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]">

          {/* ── Gallery ── */}
          <div ref={galleryRef} className="flex flex-col-reverse gap-4 md:flex-row will-change-transform">
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible md:w-[68px] flex-shrink-0">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`Lihat foto ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={cn(
                    "relative aspect-[3/4] w-[60px] md:w-full flex-shrink-0 overflow-hidden border bg-[#F5F0E6] transition-all duration-300",
                    activeImage === index
                      ? "border-[#0B4F3A] ring-1 ring-[#0B4F3A] opacity-100"
                      : "border-[#EADFD4]/60 opacity-55 hover:opacity-90 hover:border-[#EADFD4]"
                  )}
                >
                  <Image src={src} alt="" fill sizes="68px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative aspect-[3/4] flex-1 overflow-hidden border border-[#EADFD4]/60 bg-[#F5F0E6] shadow-[0_2px_20px_rgba(26,25,24,0.07)]">
              <div ref={mainImgRef} className="absolute inset-0" style={{ willChange: "opacity, transform" }}>
                <Image
                  src={gallery[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isTrending && (
                  <span className="bg-[#0B4F3A] text-[#FAF7F2] text-[9px] uppercase tracking-[0.22em] font-semibold px-3 py-1.5 shadow-sm">
                    Tren Sekarang
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#8C2323] text-[#FAF7F2] text-[9px] uppercase tracking-[0.22em] font-semibold px-3 py-1.5 shadow-sm">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                className={cn(
                  "absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center border transition-all duration-300",
                  wishlisted
                    ? "border-[#8C2323] bg-[#FAF7F2] text-[#8C2323]"
                    : "border-[#EADFD4]/80 bg-[#FAF7F2]/80 text-[#786E65] hover:border-[#8C2323] hover:text-[#8C2323]"
                )}
              >
                <Heart size={15} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
              </button>

              {/* Prev/Next arrows for multi-image gallery */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Foto sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center bg-[#FAF7F2]/80 backdrop-blur-sm border border-[#EADFD4]/60 text-[#1A1918] hover:bg-[#FAF7F2] transition-all duration-200"
                  >
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Foto berikutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center bg-[#FAF7F2]/80 backdrop-blur-sm border border-[#EADFD4]/60 text-[#1A1918] hover:bg-[#FAF7F2] transition-all duration-200"
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleThumbnailClick(i)}
                        aria-label={`Foto ${i + 1}`}
                        className={cn(
                          "h-1 transition-all duration-300",
                          i === activeImage ? "w-5 bg-[#FAF7F2]" : "w-1.5 bg-[#FAF7F2]/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Info panel ── */}
          <div ref={infoRef} className="flex flex-col will-change-transform lg:sticky lg:top-24 lg:self-start">

            {/* Name + color */}
            <div className="border-b border-[#EADFD4] pb-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#786E65] font-medium mb-2">
                {categoryLabel}
              </p>
              <h1 className="font-['Italiana',serif] text-[1.9rem] md:text-[2.2rem] font-normal leading-[1.1] text-[#1A1918]">
                {product.name}
                {product.color && (
                  <span className="block font-sans text-sm font-normal text-[#786E65] mt-1 tracking-wide">
                    {product.color}
                  </span>
                )}
              </h1>
            </div>

            {/* Price block */}
            <div className="mt-5 border-b border-[#EADFD4] pb-5 space-y-1.5">
              <p className="flex items-baseline gap-3">
                {product.originalPrice && (
                  <span className="text-sm font-normal text-[#786E65] line-through tabular-nums">{product.originalPrice}</span>
                )}
                <span className={cn(
                  "text-xl font-semibold tabular-nums",
                  product.originalPrice ? "text-[#0B4F3A]" : "text-[#1A1918]"
                )}>
                  {product.price}
                </span>
              </p>
              <p className="text-[11px] text-[#786E65]">Sudah Termasuk Pajak &amp; Bea Cukai</p>
              <p className="text-[12px] text-[#5A524A]">
                Atau 3× <span className="font-semibold tabular-nums">{product.installment}</span>{" "}
                dengan <span className="font-bold text-[#1A1918]">atome</span>
              </p>

              {/* Stock pulse */}
              <div className="mt-3 inline-flex items-center gap-2 border border-[#EADFD4] px-3 py-1.5 text-[11px] font-medium text-[#0B4F3A]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0B4F3A] opacity-60"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B4F3A]"></span>
                </span>
                Ready Stock
              </div>
            </div>

            {/* Variant selector (colors) */}
            {hasVariants && (
              <div className="mt-5 border-b border-[#EADFD4] pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#786E65] mb-3">
                  Warna — <span className="text-[#1A1918]">{product.color || "Pilih Warna"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <Link
                      key={v.id}
                      href={`/id/products/${v.id}`}
                      className={cn(
                        "relative text-[11px] border px-3 py-1.5 uppercase tracking-[0.1em] font-medium transition-all duration-200",
                        v.id === product.id
                          ? "border-[#1A1918] bg-[#1A1918] text-[#FAF7F2]"
                          : "border-[#EADFD4] text-[#786E65] hover:border-[#1A1918] hover:text-[#1A1918]"
                      )}
                    >
                      {v.color || v.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mt-5 border-b border-[#EADFD4] pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#786E65]">
                  Ukuran — <span className="text-[#1A1918]">{selectedSize}</span>
                </p>
                <Link
                  href="/id/panduan-ukuran"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#786E65] underline decoration-[#EADFD4] underline-offset-3 hover:text-[#0B4F3A] transition-colors"
                >
                  Panduan Ukuran
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[48px] border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-200",
                      selectedSize === size
                        ? "border-[#1A1918] bg-[#1A1918] text-[#FAF7F2]"
                        : "border-[#EADFD4] text-[#786E65] hover:border-[#1A1918] hover:text-[#1A1918]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to bag CTA */}
            <div className="mt-6 space-y-3">
              <button
                ref={addBtnRef}
                type="button"
                onClick={handleAddToBag}
                disabled={added}
                className={cn(
                  "relative w-full overflow-hidden flex items-center justify-between px-6 py-4 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-300",
                  added
                    ? "bg-[#0B4F3A] text-[#FAF7F2] border border-[#0B4F3A]"
                    : "bg-[#1A1918] text-[#FAF7F2] border border-[#1A1918] hover:bg-[#0B4F3A] hover:border-[#0B4F3A]",
                  "group"
                )}
                style={{ willChange: "transform" }}
              >
                {/* Shimmer */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                <span className="flex items-center gap-2">
                  {added ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      Ditambahkan ke Keranjang
                    </>
                  ) : (
                    "Masukkan ke Keranjang"
                  )}
                </span>
                <ArrowRight size={14} strokeWidth={1.5} className={cn("transition-transform duration-300", !added && "group-hover:translate-x-1")} />
              </button>

              {/* Wishlist secondary */}
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 border py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300",
                  wishlisted
                    ? "border-[#8C2323] text-[#8C2323] bg-[#8C2323]/5"
                    : "border-[#EADFD4] text-[#786E65] hover:border-[#1A1918] hover:text-[#1A1918]"
                )}
              >
                <Heart size={13} strokeWidth={1.5} fill={wishlisted ? "currentColor" : "none"} />
                {wishlisted ? "Tersimpan di Wishlist" : "Simpan ke Wishlist"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#EADFD4] pt-5">
              {[
                { icon: "🔒", label: "Pembayaran Aman" },
                { icon: "📦", label: "Gratis Ongkir JABODETABEK" },
                { icon: "↩", label: "Return 30 Hari" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-[#786E65] font-medium leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Location badge */}
            <div className="mt-4 flex items-center gap-2 border border-[#EADFD4] px-3 py-2.5 bg-[#F5F0E6]">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-[#0B4F3A] flex-shrink-0" />
              <p className="text-[11px] text-[#5A524A]">
                Produk asli PLEATSSSI. Tersedia di toko kami di Jakarta Selatan.
              </p>
            </div>

            {/* Accordion */}
            <div className="mt-6">
              <AnimatedAccordion sections={accordionSections} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <ProductCarousel title="Produk Serupa" products={relatedProducts} />
      )}
      {pairingProducts.length > 0 && (
        <ProductCarousel title="Lengkapi Tampilanmu" products={pairingProducts} />
      )}

      {/* ── Related categories ── */}
      <section
        ref={categorySectionRef}
        className="mx-auto mt-8 w-full max-w-[1400px] border-t border-[#EADFD4] px-4 py-12 xl:px-8"
      >
        <h2 className="mb-6 text-center font-['Italiana',serif] text-xl font-normal uppercase tracking-[0.2em] text-[#1A1918]">
          Kategori Terkait
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {relatedCategories.map((slug) => (
            <Link
              key={slug}
              href={`/id/${slug}`}
              className="border border-[#EADFD4] bg-[#FAF7F2] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1A1918] transition-all duration-200 hover:border-[#0B4F3A] hover:bg-[#0B4F3A] hover:text-[#FAF7F2] active:scale-95"
            >
              {CATEGORY_LABELS[slug]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
