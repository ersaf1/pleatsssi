import bagsJson from "../../docs/research/charleskeith.co.id/bags-products.json";
import shoesJson from "../../docs/research/charleskeith.co.id/shoes-products.json";
import walletsJson from "../../docs/research/charleskeith.co.id/wallets-products.json";
import accessoriesJson from "../../docs/research/charleskeith.co.id/accessories-products.json";
import kidsJson from "../../docs/research/charleskeith.co.id/kids-products.json";
import newArrivalsJson from "../../docs/research/charleskeith.co.id/new-arrivals-products.json";
import trendingJson from "../../docs/research/charleskeith.co.id/trending-products.json";
import saleJson from "../../docs/research/charleskeith.co.id/sale-products.json";
import giftsJson from "../../docs/research/charleskeith.co.id/gifts-products.json";
import galleryMapJson from "./product-gallery.json";

// Galeri PDP per produk (opsional). Isi src/data/product-gallery.json dengan
// mapping id produk -> array path lokal, lalu drop fotonya di public/images/products/.
// Contoh: { "CK2-50701691": ["/images/products/CK2-50701691/1.jpg", "/images/products/CK2-50701691/2.jpg"] }
// Jika produk tidak punya entri, galeri memakai fallback: foto utama + swatches hi-res.
const galleryMap = galleryMapJson as Record<string, string[]>;

export type CategorySlug = "bags" | "shoes" | "wallets" | "accessories" | "kids";

export interface RawProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  swatches: string[];
  category: string;
  isSale: boolean;
  pdpUrl: string;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  price: string;
  originalPrice: string | null;
  discount: string | null;
  priceValue: number;
  installment: string;
  image: string;
  hoverImage: string;
  swatches: string[];
  gallery: string[];
  category: CategorySlug;
  collections: string[];
  isSale: boolean;
  pdpUrl: string;
}

const BASE_FILES: Record<CategorySlug, RawProduct[]> = {
  bags: bagsJson,
  shoes: shoesJson,
  wallets: walletsJson,
  accessories: accessoriesJson,
  kids: kidsJson,
};

const COLLECTION_FILES: Record<string, RawProduct[]> = {
  "new-arrivals": newArrivalsJson,
  "trending-now": trendingJson,
  sale: saleJson,
  gifts: giftsJson,
};

function hiRes(url: string): string {
  return `${url}?sw=756&sh=1008`;
}

function parsePrice(raw: string): {
  price: string;
  originalPrice: string | null;
  discount: string | null;
  priceValue: number;
} {
  const saleMatch = raw.match(/^IDR(\d{1,3}(?:,\d{3})*)IDR(\d{1,3}(?:,\d{3})*)(\d+)%OFF$/);
  if (saleMatch) {
    return {
      price: `IDR${saleMatch[2]}`,
      originalPrice: `IDR${saleMatch[1]}`,
      discount: `${saleMatch[3]}% OFF`,
      priceValue: Number(saleMatch[2].replace(/,/g, "")),
    };
  }
  return {
    price: raw,
    originalPrice: null,
    discount: null,
    priceValue: Number(raw.replace(/[^0-9]/g, "")),
  };
}

function extractColor(pdpUrl: string): string {
  const match = pdpUrl.match(/_([A-Za-z0-9.]+)-ID\.html$/);
  if (!match) return "";
  return match[1]
    .replace(/\./g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferCategoryFromName(name: string): CategorySlug {
  const n = name.toLowerCase();
  if (n.includes("sepatu") || n.includes("sandal") || n.includes("pumps") || n.includes("loafers")) {
    return "shoes";
  }
  if (n.includes("dompet") || n.includes("card holder") || n.includes("wallet")) {
    return "wallets";
  }
  if (
    n.includes("charm") ||
    n.includes("kacamata") ||
    n.includes("anting") ||
    n.includes("gelang") ||
    n.includes("kalung") ||
    n.includes("ikat pinggang")
  ) {
    return "accessories";
  }
  return "bags";
}

function buildProducts(): Product[] {
  const rawById = new Map<string, RawProduct>();
  const baseCategoryById = new Map<string, CategorySlug>();
  const collectionsById = new Map<string, string[]>();

  const register = (raw: RawProduct, group: string, isBase: boolean) => {
    if (!rawById.has(raw.id)) rawById.set(raw.id, raw);
    if (isBase) baseCategoryById.set(raw.id, group as CategorySlug);
    const collections = collectionsById.get(raw.id) ?? [];
    if (!collections.includes(group)) collections.push(group);
    collectionsById.set(raw.id, collections);
  };

  for (const [slug, items] of Object.entries(BASE_FILES)) {
    for (const raw of items) register(raw, slug, true);
  }
  for (const [slug, items] of Object.entries(COLLECTION_FILES)) {
    for (const raw of items) register(raw, slug, false);
  }

  const products: Product[] = [];
  for (const [id, raw] of rawById) {
    const { price, originalPrice, discount, priceValue } = parsePrice(raw.price);
    const templateGallery = galleryMap[id];
    const fallbackGallery = [raw.image, ...raw.swatches.map(hiRes)];
    const gallery = templateGallery && templateGallery.length > 0 ? templateGallery : fallbackGallery;
    const installmentValue = Math.floor(priceValue / 3);
    products.push({
      id,
      name: raw.name,
      color: extractColor(raw.pdpUrl),
      price,
      originalPrice,
      discount,
      priceValue,
      installment: `IDR${installmentValue.toLocaleString("en-US")}`,
      image: raw.image,
      hoverImage: gallery[1] ?? raw.image,
      swatches: raw.swatches,
      gallery,
      category: baseCategoryById.get(id) ?? inferCategoryFromName(raw.name),
      collections: collectionsById.get(id) ?? [],
      isSale: raw.isSale,
      pdpUrl: raw.pdpUrl,
    });
  }
  return products;
}

export const PRODUCTS: Product[] = buildProducts();

const productById = new Map(PRODUCTS.map((p) => [p.id, p]));

const nameGroups = new Map<string, Product[]>();
for (const product of PRODUCTS) {
  const group = nameGroups.get(product.name) ?? [];
  group.push(product);
  nameGroups.set(product.name, group);
}

export function getProductById(id: string): Product | undefined {
  return productById.get(id.toUpperCase());
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductsByCollection(collection: string): Product[] {
  return PRODUCTS.filter((p) => p.collections.includes(collection));
}

export function getColorVariants(product: Product): Product[] {
  return nameGroups.get(product.name) ?? [product];
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  if (sameCategory.length >= count) return sameCategory.slice(0, count);
  const filler = PRODUCTS.filter((p) => p.category !== product.category && p.id !== product.id);
  return [...sameCategory, ...filler].slice(0, count);
}

const PAIRING_CATEGORY: Record<CategorySlug, CategorySlug> = {
  bags: "shoes",
  shoes: "bags",
  wallets: "bags",
  accessories: "bags",
  kids: "bags",
};

export function getPairingProducts(product: Product, count = 4): Product[] {
  const target = PAIRING_CATEGORY[product.category];
  const paired = PRODUCTS.filter((p) => p.category === target && p.id !== product.id);
  if (paired.length >= count) return paired.slice(0, count);
  const filler = PRODUCTS.filter((p) => p.category !== target && p.id !== product.id);
  return [...paired, ...filler].slice(0, count);
}
