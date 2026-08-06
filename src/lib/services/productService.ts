import { supabaseBrowserClient } from '../supabaseClient';
import { PRODUCTS as STATIC_PRODUCTS, type Product } from '@/data/products';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export async function getDynamicProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return STATIC_PRODUCTS;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          material,
          price,
          discount,
          status,
          categories(id, name, slug),
          product_variants(id, color, color_hex, size, sku, stock),
          product_images(id, image_url, sort_order, is_primary)
        `)
        .eq('status', 'published')
    );

    if (error || !data || data.length === 0) {
      return STATIC_PRODUCTS;
    }
    
    // Map DB structure to Product interface
    return data.map((p: any) => {
      const sortedImages = [...(p.product_images || [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const primaryImage = sortedImages.find((img: any) => img.is_primary)?.image_url || sortedImages[0]?.image_url || '';
      const nonPrimaryImg = sortedImages.find((img: any) => !img.is_primary)?.image_url;
      const hoverImage = nonPrimaryImg || primaryImage;
      const swatches = Array.from(new Set(p.product_variants?.map((v: any) => v.color_hex).filter(Boolean))) as string[];
      const priceNum = Number(p.price);
      const discountNum = Number(p.discount || 0);

      let originalPrice: string | null = null;
      if (discountNum > 0 && discountNum < 100) {
        const origVal = Math.round(priceNum / (1 - discountNum / 100));
        originalPrice = `IDR${origVal.toLocaleString('en-US')}`;
      }

      return {
        id: p.id,
        name: p.name,
        color: p.product_variants?.[0]?.color || '',
        price: `IDR${priceNum.toLocaleString('en-US')}`,
        originalPrice: originalPrice,
        discount: discountNum > 0 ? `${discountNum}% OFF` : null,
        priceValue: priceNum,
        installment: `IDR${Math.round(priceNum / 3).toLocaleString('en-US')}`,
        image: primaryImage,
        hoverImage: hoverImage,
        swatches: swatches,
        gallery: sortedImages.map((img: any) => img.image_url),
        category: p.categories?.slug || 'others',
        collections: ['new-arrivals'], // default mapped collection
        isSale: discountNum > 0,
        pdpUrl: `/id/products/${p.id}`
      };
    }) as Product[];
  } catch {
    return STATIC_PRODUCTS;
  }
}
