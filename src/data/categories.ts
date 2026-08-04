import type { CategorySlug } from "./products";

export interface CategoryMeta {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  description: string;
  kind: "category" | "collection";
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  bags: "Tas",
  shoes: "Sepatu",
  wallets: "Dompet",
  accessories: "Aksesori",
  kids: "Koleksi Anak-Anak",
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "new-arrivals": {
    slug: "new-arrivals",
    title: "PRODUK BARU",
    breadcrumbLabel: "Produk Baru",
    description:
      "Jelajahi koleksi terbaru CHARLES & KEITH — tas, sepatu, dompet, dan aksesori yang baru saja tiba minggu ini.",
    kind: "collection",
  },
  shoes: {
    slug: "shoes",
    title: "SEPATU",
    breadcrumbLabel: "Sepatu",
    description:
      "Dari pumps elegan hingga loafers kasual, temukan sepatu yang sempurna untuk setiap kesempatan.",
    kind: "category",
  },
  bags: {
    slug: "bags",
    title: "TAS",
    breadcrumbLabel: "Tas",
    description:
      "Koleksi tas CHARLES & KEITH — top handle, tas bahu, tote, dan crossbody dengan desain modern yang fungsional.",
    kind: "category",
  },
  wallets: {
    slug: "wallets",
    title: "DOMPET",
    breadcrumbLabel: "Dompet",
    description:
      "Dompet dan card holder dengan detail quilted dan siluet ramping untuk menyimpan kartu dan uang dengan rapi.",
    kind: "category",
  },
  accessories: {
    slug: "accessories",
    title: "AKSESORI",
    breadcrumbLabel: "Aksesori",
    description:
      "Sempurnakan penampilanmu dengan charm, kacamata, dan perhiasan dari koleksi aksesori CHARLES & KEITH.",
    kind: "category",
  },
  kids: {
    slug: "kids",
    title: "KOLEKSI ANAK-ANAK",
    breadcrumbLabel: "Koleksi Anak-Anak",
    description:
      "Tas dan sepatu anak-anak dengan desain playful yang nyaman dipakai seharian.",
    kind: "category",
  },
  "trending-now": {
    slug: "trending-now",
    title: "TRENDING NOW",
    breadcrumbLabel: "Trending Now",
    description:
      "Gaya paling dicari saat ini — produk favorit yang sedang tren dan cepat habis.",
    kind: "collection",
  },
  sale: {
    slug: "sale",
    title: "SALE",
    breadcrumbLabel: "Sale",
    description:
      "Penawaran terbatas — dapatkan tas, sepatu, dan aksesori pilihan dengan potongan harga spesial.",
    kind: "collection",
  },
  gifts: {
    slug: "gifts",
    title: "GIFTS",
    breadcrumbLabel: "Gifts",
    description:
      "Hadiah sempurna untuk orang tersayang — pilihan tas mini, dompet, charm, dan perhiasan yang berkesan.",
    kind: "collection",
  },
};

export const CATEGORY_ROUTE_SLUGS = [
  "new-arrivals",
  "shoes",
  "bags",
  "wallets",
  "accessories",
  "kids",
  "trending-now",
  "sale",
] as const;
