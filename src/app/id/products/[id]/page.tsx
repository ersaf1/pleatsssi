import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS } from "@/data/categories";
import { getDynamicProducts } from "@/lib/services/productService";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const products = await getDynamicProducts();
  const product = products.find((p) => p.id.toUpperCase() === id.toUpperCase());
  if (!product) return {};
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  return {
    title: `${product.name} | PLEATSSSI Indonesia`,
    description: `Belanja ${product.name} (${categoryLabel}) di situs resmi PLEATSSSI Indonesia. ${product.price} — sudah termasuk pajak & bea cukai.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getDynamicProducts();
  const product = products.find((p) => p.id.toUpperCase() === id.toUpperCase());
  if (!product) notFound();

  const variants = products.filter((p) => p.name === product.name);
  const sameCategory = products.filter((p) => p.category === product.category && p.id.toUpperCase() !== id.toUpperCase());
  const otherCategory = products.filter((p) => p.category !== product.category && p.id.toUpperCase() !== id.toUpperCase());
  const relatedProducts = (sameCategory.length >= 4 ? sameCategory : [...sameCategory, ...otherCategory]).slice(0, 4);

  const pairingProducts = products.filter((p) => p.id.toUpperCase() !== id.toUpperCase()).slice(0, 4);

  return (
    <ProductDetail
      product={product}
      variants={variants.length > 0 ? variants : [product]}
      relatedProducts={relatedProducts}
      pairingProducts={pairingProducts}
    />
  );
}
