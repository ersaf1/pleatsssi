"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import type { CategorySlug, Product } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { ProductCarousel } from "./ProductCarousel";

const SIZE_OPTIONS: Record<CategorySlug, string[]> = {
  bags: ["S", "M", "XL"],
  shoes: ["35", "36", "37", "38", "39", "40"],
  wallets: ["ONE SIZE"],
  accessories: ["ONE SIZE"],
  kids: ["ONE SIZE"],
};

const EDITORS_NOTE: Record<CategorySlug, string> = {
  bags: "adalah perpaduan sempurna antara gaya dan fungsi. Siluetnya yang modern dan ruangnya yang fungsional menjadikannya pilihan tepat untuk menemani hari-harimu, dari kantor hingga akhir pekan.",
  shoes: "dirancang untuk kenyamanan sepanjang hari, menghadirkan keseimbangan antara gaya klasik dan sentuhan kontemporer yang mudah dipadukan dengan berbagai busana.",
  wallets: "menawarkan desain ramping dengan kompartemen fungsional — teman setia untuk menyimpan kartu, uang tunai, dan struk dengan rapi.",
  accessories: "membuktikan bahwa detail kecil membawa dampak besar. Aksen sempurna untuk melengkapi dan mempersonalisasi penampilanmu.",
  kids: "dirancang khusus untuk si kecil — ringan, nyaman dipakai seharian, dan penuh gaya dengan detail yang playful.",
};

const PRODUCT_DETAILS: Record<CategorySlug, string[]> = {
  bags: [
    "Bahan: Kulit sintetis premium",
    "Dimensi: Tinggi 22 cm x Lebar 28 cm x Tebal 12 cm",
    "Lapisan dalam: Kain",
    "Penutup: Ritsleting",
    "Dilengkapi tali yang dapat disesuaikan dan dust bag",
  ],
  shoes: [
    "Bahan bagian atas: Kulit sintetis",
    "Sol luar: Karet anti-slip",
    "Tinggi hak: 3 cm",
    "Bantalan dalam yang empuk untuk kenyamanan ekstra",
  ],
  wallets: [
    "Bahan: Kulit sintetis",
    "Dimensi: Panjang 19 cm x Tinggi 10 cm x Lebar 2.5 cm",
    "8 slot kartu, 2 kantong uang kertas, 1 kantong ritsleting",
    "Penutup: Kancing magnet",
  ],
  accessories: [
    "Bahan: Campuran logam berlapis dan akrilik",
    "Ringan dan nyaman digunakan sehari-hari",
    "Dikemas dalam kotak CHARLES & KEITH",
  ],
  kids: [
    "Bahan: Kulit sintetis lembut yang aman untuk anak",
    "Ringan dan mudah dibersihkan",
    "Dilengkapi penutup yang mudah dibuka-tutup oleh anak",
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
  const gallery = product.gallery;
  const [activeImage, setActiveImage] = useState(0);
  const sizes = SIZE_OPTIONS[product.category];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(0);

  const addItem = useCartStore((state) => state.addItem);

  const isTrending = product.collections.includes("trending-now");
  const hasVariants = variants.length > 1;

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
    window.setTimeout(() => setAdded(false), 2000);
  }

  const accordionSections = [
    {
      title: "Editor's Note",
      content: (
        <p>
          <span className="font-semibold text-[#1A1918]">{product.name}</span> {EDITORS_NOTE[product.category]}
        </p>
      ),
    },
    {
      title: "Detail Produk & Instruksi Perawatan",
      content: (
        <div className="space-y-4">
          <ul className="list-disc space-y-1 pl-5">
            {PRODUCT_DETAILS[product.category].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div>
            <p className="mb-1 font-semibold text-[#1A1918]">Instruksi Perawatan</p>
            <ul className="list-disc space-y-1 pl-5">
              {CARE_INSTRUCTIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Pengiriman & Pengembalian",
      content: (
        <ul className="list-disc space-y-1 pl-5">
          {SHIPPING_RETURNS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
  ];

  const relatedCategories = (Object.keys(CATEGORY_LABELS) as CategorySlug[]).filter(
    (slug) => slug !== product.category
  );

  return (
    <div className="bg-[#FAF7F2]/40 pb-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 xl:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[12px] text-[#786E65]">
          <Link href="/" className="transition-colors hover:text-[#0B4F3A]">
            Beranda
          </Link>
          <span className="mx-2 text-[#D4C9B8]" aria-hidden="true">
            |
          </span>
          <Link href={`/id/${product.category}`} className="transition-colors hover:text-[#0B4F3A]">
            {CATEGORY_LABELS[product.category]}
          </Link>
          <span className="mx-2 text-[#D4C9B8]" aria-hidden="true">
            |
          </span>
          <span className="font-medium text-[#1A1918]">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* ── Galeri ─────────────────────────────────────────────── */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto md:flex-col md:overflow-visible">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Lihat foto ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={cn(
                    "relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-sm border bg-[#F5F0E6] transition-all",
                    activeImage === index
                      ? "border-[#0B4F3A] ring-1 ring-[#0B4F3A]"
                      : "border-[#EADFD4]/60 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-sm border border-[#EADFD4]/80 bg-[#F5F0E6] shadow-sm">
              <Image
                src={gallery[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {isTrending && (
                <span className="absolute left-3 top-4 bg-[#0B4F3A] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#FAF7F2] shadow-sm">
                  Tren Sekarang
                </span>
              )}
              {product.discount && (
                <span className="absolute right-3 top-4 bg-[#8C2323] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#FAF7F2] shadow-sm">
                  {product.discount}
                </span>
              )}
            </div>
          </div>

          {/* ── Info produk ────────────────────────────────────────── */}
          <div className="flex flex-col justify-start">
            <h1 className="font-['Italiana',serif] text-2xl font-normal leading-snug text-[#1A1918] md:text-3xl">
              {product.name}
              {product.color && <span className="font-sans text-lg font-normal text-[#786E65]"> - {product.color}</span>}
            </h1>

            <div className="mt-4 border-b border-[#EADFD4] pb-5">
              <p className="text-xl font-medium">
                {product.originalPrice && (
                  <span className="mr-2.5 text-base font-normal text-[#786E65] line-through">{product.originalPrice}</span>
                )}
                <span className={cn(product.originalPrice ? "font-semibold text-[#0B4F3A]" : "font-semibold text-[#1A1918]")}>
                  {product.price}
                </span>
              </p>
              <p className="mt-1 text-[12px] text-[#786E65]">(Sudah Termasuk Pajak &amp; Bea Cukai)</p>
              <p className="mt-2 text-[13px] text-[#5A524A]">
                Atau dengan 3 kali pembayaran {product.installment} dengan{" "}
                <span className="font-bold lowercase text-[#1A1918]">atome</span>
              </p>

              {/* Stock Indicator Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#EADFD4] bg-[#FAF7F2] px-3 py-1 text-[11px] font-medium text-[#0B4F3A]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0B4F3A] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B4F3A]"></span>
                </span>
                <span>Stok Tersedia — Ready Stock</span>
              </div>
            </div>

            {/* Warna */}
            <div className="mt-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#786E65]">
                Warna{product.color ? `: ${product.color}` : ""}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {hasVariants
                  ? variants.map((variant) => (
                      <Link
                        key={variant.id}
                        href={`/id/products/${variant.id}`}
                        aria-label={`Warna ${variant.color}`}
                        aria-current={variant.id === product.id ? "true" : undefined}
                        className={cn(
                          "relative block h-9 w-9 overflow-hidden rounded-full border transition-all",
                          variant.id === product.id
                            ? "border-[#0B4F3A] ring-2 ring-[#0B4F3A] ring-offset-2 ring-offset-[#FAF7F2]"
                            : "border-[#EADFD4] opacity-70 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={variant.swatches[0]}
                          alt={variant.color}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </Link>
                    ))
                  : product.swatches.map((swatch, index) => (
                      <span
                        key={swatch}
                        className={cn(
                          "relative block h-9 w-9 overflow-hidden rounded-full border",
                          index === 0
                            ? "border-[#0B4F3A] ring-2 ring-[#0B4F3A] ring-offset-2 ring-offset-[#FAF7F2]"
                            : "border-[#EADFD4] opacity-70"
                        )}
                      >
                        <Image src={swatch} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    ))}
              </div>
            </div>

            {/* Ukuran */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#786E65]">
                  Ukuran <span className="ml-2 text-[12px] normal-case tracking-normal text-[#5A524A]">Tersedia</span>
                </p>
                <Link
                  href="/id/panduan-ukuran"
                  className="text-[12px] text-[#786E65] underline transition-colors hover:text-[#0B4F3A]"
                >
                  Panduan Ukuran
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      "min-w-[48px] rounded-sm border px-4 py-2.5 text-[13px] font-medium transition-all",
                      selectedSize === size
                        ? "border-[#0B4F3A] bg-[#0B4F3A] text-[#FAF7F2] shadow-sm"
                        : "border-[#EADFD4] bg-[#FAF7F2] text-[#1A1918] hover:border-[#0B4F3A] hover:text-[#0B4F3A]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Aksi */}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleAddToBag}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 rounded-sm text-[12px] font-medium uppercase tracking-[0.2em] transition-all shadow-sm",
                  added
                    ? "bg-[#073628] text-[#FAF7F2]"
                    : "bg-[#0B4F3A] text-[#FAF7F2] hover:bg-[#073628]"
                )}
              >
                {added && <Check size={16} strokeWidth={2} />}
                {added ? "Ditambahkan ke Keranjang" : "Tambahkan ke Keranjang"}
              </button>
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                aria-label={wishlisted ? "Hapus dari wishlist" : "Tambahkan ke wishlist"}
                aria-pressed={wishlisted}
                className="flex h-12 w-12 items-center justify-center rounded-sm border border-[#EADFD4] bg-[#FAF7F2] text-[#1A1918] transition-colors hover:border-[#0B4F3A] hover:text-[#0B4F3A]"
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className={cn(wishlisted && "fill-[#0B4F3A] text-[#0B4F3A]")}
                />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link
                href="/id/lokasi-toko"
                className="inline-flex items-center gap-2 text-[13px] text-[#786E65] underline transition-colors hover:text-[#0B4F3A]"
              >
                <MapPin size={16} strokeWidth={1.5} />
                Temukan di toko
              </Link>

              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#786E65]">
                <ShieldCheck size={16} className="text-[#0B4F3A]" />
                100% Produk Original
              </span>
            </div>

            {/* Accordion */}
            <div className="mt-8 border-t border-[#EADFD4]">
              {accordionSections.map((section, index) => {
                const isOpen = openSection === index;
                return (
                  <div key={section.title} className="border-b border-[#EADFD4]">
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left font-['Italiana',serif] text-sm font-semibold uppercase tracking-[0.15em] text-[#1A1918] transition-colors hover:text-[#0B4F3A]"
                    >
                      {section.title}
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.5} className="text-[#0B4F3A]" />
                      ) : (
                        <Plus size={16} strokeWidth={1.5} className="text-[#786E65]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="pb-5 text-[13px] leading-relaxed text-[#5A524A]">
                        {section.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel rekomendasi */}
      <ProductCarousel title="Anda Mungkin Juga Menyukai" products={relatedProducts} />
      <ProductCarousel title="Padukan Dengan" products={pairingProducts} />

      {/* Kategori terkait */}
      <section className="mx-auto mt-8 w-full max-w-[1600px] border-t border-[#EADFD4] px-4 py-12 xl:px-8">
        <h2 className="mb-6 text-center font-['Italiana',serif] text-xl font-normal uppercase tracking-[0.2em] text-[#1A1918]">
          Kategori Terkait
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {relatedCategories.map((slug) => (
            <Link
              key={slug}
              href={`/id/${slug}`}
              className="rounded-sm border border-[#EADFD4] bg-[#FAF7F2] px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.15em] text-[#1A1918] transition-all hover:border-[#0B4F3A] hover:bg-[#0B4F3A] hover:text-[#FAF7F2]"
            >
              {CATEGORY_LABELS[slug]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

