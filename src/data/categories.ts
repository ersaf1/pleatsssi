import type { CategorySlug } from "./products";

export interface CategoryMeta {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  description: string;
  kind: "category" | "collection";
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  skirts: "Rok",
  tops: "Atasan",
  pants: "Celana",
  others: "Lainnya",
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "new-arrivals": {
    slug: "new-arrivals",
    title: "PRODUK BARU",
    breadcrumbLabel: "Produk Baru",
    description:
      "Jelajahi koleksi terbaru PLEATSSSI — rok, atasan, dan celana yang baru saja tiba minggu ini.",
    kind: "collection",
  },
  skirts: {
    slug: "skirts",
    title: "ROK",
    breadcrumbLabel: "Rok",
    description:
      "Koleksi rok PLEATSSSI — rok lipit, mini, dan midi dengan detail modern yang mudah dipadukan.",
    kind: "category",
  },
  tops: {
    slug: "tops",
    title: "ATASAN",
    breadcrumbLabel: "Atasan",
    description:
      "Atasan PLEATSSSI — t-shirt, long top, tunik, dan blus dengan siluet nyaman untuk setiap kesempatan.",
    kind: "category",
  },
  pants: {
    slug: "pants",
    title: "CELANA",
    breadcrumbLabel: "Celana",
    description:
      "Celana PLEATSSSI — panjang dan pendek dengan potongan yang stylish untuk tampilan kasual maupun formal.",
    kind: "category",
  },
  others: {
    slug: "others",
    title: "LAINNYA",
    breadcrumbLabel: "Lainnya",
    description:
      "Temukan item pilihan dari koleksi PLEATSSSI yang tidak termasuk dalam kategori utama.",
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
      "Penawaran terbatas — dapatkan rok, atasan, dan celana pilihan dengan harga spesial.",
    kind: "collection",
  },
  gifts: {
    slug: "gifts",
    title: "GIFTS",
    breadcrumbLabel: "Gifts",
    description:
      "Hadiah sempurna untuk orang tersayang — pilihan fashion PLEATSSSI yang berkesan.",
    kind: "collection",
  },
};

export const CATEGORY_ROUTE_SLUGS = [
  "new-arrivals",
  "skirts",
  "tops",
  "pants",
  "others",
  "trending-now",
  "sale",
] as const;
