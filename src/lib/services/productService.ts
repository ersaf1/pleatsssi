import { supabaseBrowserClient } from '../supabaseClient';
import { PRODUCTS as STATIC_PRODUCTS, type Product } from '@/data/products';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-supabase-project') || url.includes('placeholder') || url.includes('example.com')) return false;
  if (key.includes('your-anon-key') || key.includes('placeholder')) return false;
  return true;
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Supabase query timeout')), ms);
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

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
      const primaryImage = p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url || '';
      const hoverImage = p.product_images?.[1]?.image_url || primaryImage;
      const swatches = Array.from(new Set(p.product_variants?.map((v: any) => v.color_hex).filter(Boolean))) as string[];
      
      return {
        id: p.id,
        name: p.name,
        color: p.product_variants?.[0]?.color || '',
        price: `IDR${Number(p.price).toLocaleString('en-US')}`,
        originalPrice: p.discount > 0 ? `IDR${Number(p.price * (1 + p.discount/100)).toLocaleString('en-US')}` : null,
        discount: p.discount > 0 ? `${p.discount}% OFF` : null,
        priceValue: Number(p.price),
        installment: `IDR${Math.round(Number(p.price) / 3).toLocaleString('en-US')}`,
        image: primaryImage,
        hoverImage: hoverImage,
        swatches: swatches,
        gallery: p.product_images?.map((img: any) => img.image_url) || [],
        category: p.categories?.slug || 'others',
        collections: ['new-arrivals'], // default mapped collection
        isSale: p.discount > 0,
        pdpUrl: `/id/products/${p.id}`
      };
    }) as Product[];
  } catch {
    return STATIC_PRODUCTS;
  }
}
