import pleatsssiJson from "./pleatsssi-products.json";

export type CategorySlug = "skirts" | "tops" | "pants" | "others";

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

export const PRODUCTS: Product[] = pleatsssiJson as Product[];

const productById = new Map(PRODUCTS.map((p) => [p.id.toUpperCase(), p]));

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
  skirts: "tops",
  tops: "pants",
  pants: "tops",
  others: "tops",
};

export function getPairingProducts(product: Product, count = 4): Product[] {
  const target = PAIRING_CATEGORY[product.category];
  const paired = PRODUCTS.filter((p) => p.category === target && p.id !== product.id);
  if (paired.length >= count) return paired.slice(0, count);
  const filler = PRODUCTS.filter((p) => p.category !== target && p.id !== product.id);
  return [...paired, ...filler].slice(0, count);
}
