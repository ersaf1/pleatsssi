"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, MapPin, Minus, Plus } from "lucide-react";
import type { CategorySlug, Product } from "@/data/products";
import { CATEGORY_LABELS } from "@/data/categories";
import { cn } from "@/lib/utils";
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

  const isTrending = product.collections.includes("trending-now");
  const hasVariants = variants.length > 1;

  function handleAddToBag() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  const accordionSections = [
    {
      title: "Editor's Note",
      content: (
        <p>
          <span className="font-bold">{product.name}</span> {EDITORS_NOTE[product.category]}
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
            <p className="mb-1 font-bold">Instruksi Perawatan</p>
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
    <div className="pb-4">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 xl:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[12px] text-gray-500">
          <Link href="/" className="transition-colors hover:text-black">
            Beranda
          </Link>
          <span className="mx-2" aria-hidden="true">
            |
          </span>
          <Link href={`/id/${product.category}`} className="transition-colors hover:text-black">
            {CATEGORY_LABELS[product.category]}
          </Link>
          <span className="mx-2" aria-hidden="true">
            |
          </span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* ── Galeri ─────────────────────────────────────────────── */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {gallery.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Lihat foto ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={cn(
                    "relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden bg-[#f5f5f5] transition-shadow",
                    activeImage === index ? "ring-1 ring-black" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-[#f5f5f5]">
              <Image
                src={gallery[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {isTrending && (
                <span className="absolute left-0 top-4 bg-black px-3 py-1 text-[11px] uppercase tracking-widest text-white">
                  Tren Sekarang
                </span>
              )}
              {product.discount && (
                <span className="absolute right-0 top-4 bg-[#cc0000] px-3 py-1 text-[11px] uppercase tracking-widest text-white">
                  {product.discount}
                </span>
              )}
            </div>
          </div>

          {/* ── Info produk ────────────────────────────────────────── */}
          <div>
            <h1 className="text-xl font-bold leading-snug md:text-2xl">
              {product.name}
              {product.color && <span className="font-normal"> - {product.color}</span>}
            </h1>

            <div className="mt-3">
              <p className="text-lg">
                {product.originalPrice && (
                  <span className="mr-2 text-gray-400 line-through">{product.originalPrice}</span>
                )}
                <span className={cn(product.originalPrice && "text-[#cc0000]")}>{product.price}</span>
              </p>
              <p className="mt-1 text-[12px] text-gray-500">(Sudah Termasuk Pajak &amp; Bea Cukai)</p>
              <p className="mt-2 text-[13px] text-gray-600">
                Atau dengan 3 kali pembayaran {product.installment} dengan{" "}
                <span className="font-bold lowercase">atome</span>
              </p>
            </div>

            {/* Warna */}
            <div className="mt-8">
              <p className="text-[13px] uppercase tracking-wider">
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
                          "relative block h-9 w-9 overflow-hidden rounded-full transition-shadow",
                          variant.id === product.id
                            ? "ring-1 ring-black ring-offset-2"
                            : "opacity-70 hover:opacity-100"
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
                          "relative block h-9 w-9 overflow-hidden rounded-full",
                          index === 0 ? "ring-1 ring-black ring-offset-2" : "opacity-70"
                        )}
                      >
                        <Image src={swatch} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    ))}
              </div>
            </div>

            {/* Ukuran */}
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="text-[13px] uppercase tracking-wider">
                  Ukuran <span className="ml-2 text-[12px] normal-case tracking-normal text-gray-500">Tersedia</span>
                </p>
                <Link
                  href="/id/panduan-ukuran"
                  className="text-[12px] text-gray-500 underline transition-colors hover:text-black"
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
                      "min-w-[48px] border px-4 py-2.5 text-[13px] transition-colors",
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-black hover:border-black"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Aksi */}
            <div className="mt-8 flex gap-2">
              <button
                type="button"
                onClick={handleAddToBag}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 text-[13px] uppercase tracking-widest transition-colors",
                  added ? "bg-[#1a7a1a] text-white" : "bg-black text-white hover:bg-gray-800"
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
                className="flex h-12 w-12 items-center justify-center border border-gray-300 transition-colors hover:border-black"
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className={cn(wishlisted && "fill-black")}
                />
              </button>
            </div>

            <Link
              href="/id/lokasi-toko"
              className="mt-4 inline-flex items-center gap-2 text-[13px] text-gray-600 underline transition-colors hover:text-black"
            >
              <MapPin size={16} strokeWidth={1.5} />
              Temukan di toko
            </Link>

            {/* Accordion */}
            <div className="mt-8 border-t border-gray-200">
              {accordionSections.map((section, index) => {
                const isOpen = openSection === index;
                return (
                  <div key={section.title} className="border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left text-[13px] font-bold uppercase tracking-wider"
                    >
                      {section.title}
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.5} />
                      ) : (
                        <Plus size={16} strokeWidth={1.5} />
                      )}
                    </button>
                    {isOpen && (
                      <div className="pb-5 text-[13px] leading-relaxed text-gray-600">
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
      <section className="mx-auto w-full max-w-[1600px] px-4 py-12 xl:px-8">
        <h2 className="mb-6 text-center text-lg font-bold uppercase tracking-[0.2em]">
          Kategori Terkait
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {relatedCategories.map((slug) => (
            <Link
              key={slug}
              href={`/id/${slug}`}
              className="border border-gray-300 px-6 py-2.5 text-[13px] uppercase tracking-wider transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              {CATEGORY_LABELS[slug]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
