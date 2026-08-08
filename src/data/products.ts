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

export interface GroupedProduct {
  id: string; // Base family ID e.g. "BAGGY", "AGATE", "ALPHA"
  familyName: string; // e.g. "BAGGY", "AGATE"
  priceDisplay: string; // e.g. "IDR865,000 - IDR960,000" or single price
  priceValue: number; // min priceValue
  image: string; // Primary image (from first item)
  hoverImage: string; // On-model hover image for the family
  items: Product[]; // List of products belonging to this family
  pieceCount: number; // Number of items in family (e.g. 3)
  category: CategorySlug;
  collections: string[];
  isSale: boolean;
  discount: string | null;
  swatches: string[]; // Aggregated unique swatches
}

export const PRODUCTS: Product[] = pleatsssiJson as Product[];

const productById = new Map(PRODUCTS.map((p) => [p.id.toUpperCase(), p]));

const nameGroups = new Map<string, Product[]>();
for (const product of PRODUCTS) {
  const group = nameGroups.get(product.name) ?? [];
  group.push(product);
  nameGroups.set(product.name, group);
}

export function extractFamilyName(product: Product): string {
  const name = product.name.trim();
  const image = product.image || "";

  const match = image.match(/\/images\/products\/([^/]+)\//i);
  let folder = match ? match[1].trim() : "";

  if (folder.includes("&")) {
    const parts = folder.split("&").map((s) => s.trim());
    for (const part of parts) {
      if (name.toUpperCase().startsWith(part.toUpperCase())) {
        folder = part;
        break;
      }
    }
  }

  let cleaned = name;
  cleaned = cleaned.replace(/LONGTOPTUNIK/gi, "LONG TOP TUNIK");
  cleaned = cleaned.replace(/^THE AYE/gi, "THE EYE");

  const suffixRegex = /\s+(SHORT PANTS|SHORT PANT|LONG TOP TUNIK|LONG TOPTUNIK|LONG TOP|SHORT TOP|TOP 65\s*CM|65\s*CM|PANTS|PANT|SKIRT|TOP|TUNIK|TOO|ONE|TWO|THREE|TREE|SHORT|CURL|HALF KANAN|HALF KIRI)$/gi;

  let prev: string;
  do {
    prev = cleaned;
    cleaned = cleaned.replace(suffixRegex, "").trim();
  } while (cleaned !== prev && cleaned.length > 0);

  if (cleaned.toUpperCase() === "APLHA") return "ALPHA";
  if (cleaned.toUpperCase() === "DAY NIGT") return "DAY NIGHT";
  if (cleaned.toUpperCase() === "BACKY") return "BAGGY";

  if (cleaned.toUpperCase().startsWith("IMG") && folder && folder !== ".") {
    return folder.toUpperCase();
  }

  return cleaned.toUpperCase() || name.toUpperCase();
}

export function groupProductsByFamily(products: Product[]): GroupedProduct[] {
  const familyMap = new Map<string, Product[]>();

  for (const product of products) {
    const familyName = extractFamilyName(product);
    if (!familyMap.has(familyName)) {
      familyMap.set(familyName, []);
    }
    familyMap.get(familyName)!.push(product);
  }

  const grouped: GroupedProduct[] = [];

  for (const [familyName, items] of familyMap.entries()) {
    let minItem = items[0];
    let maxItem = items[0];

    for (const item of items) {
      if (item.priceValue < minItem.priceValue) minItem = item;
      if (item.priceValue > maxItem.priceValue) maxItem = item;
    }

    const priceDisplay =
      minItem.priceValue === maxItem.priceValue
        ? minItem.price
        : `${minItem.price} - ${maxItem.price}`;

    const hoverItem = items.find((p) => p.hoverImage && p.hoverImage !== p.image) || items[0];
    const hoverImage = hoverItem.hoverImage || hoverItem.image;

    const collections = Array.from(new Set(items.flatMap((p) => p.collections || [])));
    const swatches = Array.from(new Set(items.flatMap((p) => p.swatches || [])));
    const isSale = items.some((p) => p.isSale);
    const discount = items.find((p) => p.discount !== null)?.discount ?? null;

    grouped.push({
      id: familyName,
      familyName,
      priceDisplay,
      priceValue: minItem.priceValue,
      image: items[0].image,
      hoverImage,
      items,
      pieceCount: items.length,
      category: items[0].category,
      collections,
      isSale,
      discount,
      swatches,
    });
  }

  return grouped;
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
