import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getColorVariants,
  getPairingProducts,
  getProductById,
  getRelatedProducts,
} from "@/data/products";
import { CATEGORY_LABELS } from "@/data/categories";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} | CHARLES & KEITH Indonesia`,
    description: `Belanja ${product.name} (${CATEGORY_LABELS[product.category]}) di situs resmi CHARLES & KEITH Indonesia. ${product.price} — sudah termasuk pajak & bea cukai.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      variants={getColorVariants(product)}
      relatedProducts={getRelatedProducts(product)}
      pairingProducts={getPairingProducts(product)}
    />
  );
}
