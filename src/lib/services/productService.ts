import { supabaseBrowserClient } from '../supabaseClient';
import { PRODUCTS as STATIC_PRODUCTS, type Product } from '@/data/products';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

interface DbProductImage {
  id: string;
  image_url: string;
  sort_order?: number;
  is_primary?: boolean;
}

interface DbProductVariant {
  id: string;
  color?: string;
  color_hex?: string;
  size?: string;
  sku?: string;
  stock?: number;
}

interface DbProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  price: number | string;
  discount?: number | string;
  status: string;
  category_id?: string;
  size_chart_id?: string | null;
  collections?: string[];
  categories?: DbProductCategory;
  product_variants?: DbProductVariant[];
  product_images?: DbProductImage[];
  created_at?: string;
}

export interface AdminProductVariant {
  id?: string;
  color: string;
  color_hex: string;
  size: string;
  sku: string;
  stock: number;
}

export interface AdminProductImage {
  id?: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

export interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
  price: number;
  discount: number;
  status: 'draft' | 'published' | 'archived' | string;
  category_id: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  size_chart_id?: string | null;
  collections: string[];
  created_at?: string;
  product_variants: AdminProductVariant[];
  product_images: AdminProductImage[];
}

export interface AdminProductCreateInput {
  name: string;
  slug: string;
  category_id: string;
  price: number;
  discount?: number | null;
  status?: 'draft' | 'published' | 'archived' | string;
  description?: string | null;
  material?: string | null;
  size_chart_id?: string | null;
  collections?: string[];
  variants?: AdminProductVariant[];
  images?: AdminProductImage[];
}

export interface AdminProductUpdateInput {
  name?: string;
  slug?: string;
  category_id?: string;
  price?: number;
  discount?: number | null;
  status?: 'draft' | 'published' | 'archived' | string;
  description?: string | null;
  material?: string | null;
  size_chart_id?: string | null;
  collections?: string[] | null;
  variants?: AdminProductVariant[];
  images?: AdminProductImage[];
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
          collections,
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
    return (data as unknown as DbProduct[]).map((p: DbProduct) => {
      const sortedImages = [...(p.product_images || [])].sort((a: DbProductImage, b: DbProductImage) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      const primaryImage = sortedImages.find((img: DbProductImage) => img.is_primary)?.image_url || sortedImages[0]?.image_url || '';
      const nonPrimaryImg = sortedImages.find((img: DbProductImage) => !img.is_primary)?.image_url;
      const hoverImage = nonPrimaryImg || primaryImage;
      const swatches = Array.from(new Set(p.product_variants?.map((v: DbProductVariant) => v.color_hex).filter(Boolean))) as string[];
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
        gallery: sortedImages.map((img: DbProductImage) => img.image_url),
        category: (p.categories?.slug || 'others') as Product['category'],
        collections: p.collections && p.collections.length > 0 ? p.collections : ['new-arrivals'],
        isSale: discountNum > 0,
        pdpUrl: `/id/products/${p.id}`
      };
    }) as Product[];
  } catch {
    return STATIC_PRODUCTS;
  }
}

export async function getAdminProducts(): Promise<AdminProductItem[]> {
  const fallback: AdminProductItem[] = STATIC_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.id.toLowerCase(),
    description: 'Pleated signature piece crafted with high quality fabric.',
    material: '100% Polyester Pleats',
    price: p.priceValue,
    discount: p.discount ? parseInt(p.discount) : 0,
    status: 'published',
    category_id: p.category,
    categories: { id: p.category, name: p.category.toUpperCase(), slug: p.category },
    size_chart_id: null,
    collections: p.collections || ['new-arrivals'],
    product_variants: [
      {
        id: `var-${p.id}-1`,
        color: p.color || 'Default',
        color_hex: p.swatches?.[0] || '#000000',
        size: 'ALL SIZE',
        sku: `${p.id.toUpperCase()}-ALL`,
        stock: 25,
      },
    ],
    product_images: (p.gallery || [p.image]).map((img, idx) => ({
      id: `img-${p.id}-${idx}`,
      image_url: img,
      sort_order: idx,
      is_primary: idx === 0,
    })),
  }));

  if (!isSupabaseConfigured()) {
    return fallback;
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
          category_id,
          size_chart_id,
          collections,
          created_at,
          categories(id, name, slug),
          product_variants(id, color, color_hex, size, sku, stock),
          product_images(id, image_url, sort_order, is_primary)
        `)
        .order('created_at', { ascending: false })
    );

    if (error || !data || data.length === 0) {
      return fallback;
    }

    return (data as unknown as DbProduct[]).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? null,
      material: p.material ?? null,
      price: Number(p.price),
      discount: Number(p.discount || 0),
      status: p.status,
      category_id: p.category_id || p.categories?.id || '',
      categories: p.categories ? { id: p.categories.id, name: p.categories.name, slug: p.categories.slug } : null,
      size_chart_id: p.size_chart_id ?? null,
      collections: Array.isArray(p.collections) ? p.collections : [],
      created_at: p.created_at,
      product_variants: Array.isArray(p.product_variants)
        ? p.product_variants.map((v) => ({
            id: v.id,
            color: v.color || '',
            color_hex: v.color_hex || '#000000',
            size: v.size || 'ALL SIZE',
            sku: v.sku || '',
            stock: v.stock ?? 0,
          }))
        : [],
      product_images: Array.isArray(p.product_images)
        ? [...p.product_images]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((img) => ({
              id: img.id,
              image_url: img.image_url,
              sort_order: img.sort_order ?? 0,
              is_primary: !!img.is_primary,
            }))
        : [],
    }));
  } catch {
    return fallback;
  }
}

export async function createProduct(
  input: AdminProductCreateInput
): Promise<{ data: AdminProductItem | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const { data: product, error: prodError } = await supabaseBrowserClient
      .from('products')
      .insert({
        name: input.name.trim(),
        slug: input.slug.trim(),
        category_id: input.category_id,
        price: input.price,
        discount: input.discount ?? 0,
        status: input.status || 'draft',
        description: input.description || null,
        material: input.material || null,
        size_chart_id: input.size_chart_id || null,
        collections: input.collections || [],
      })
      .select(`
        id,
        name,
        slug,
        description,
        material,
        price,
        discount,
        status,
        category_id,
        size_chart_id,
        collections,
        created_at,
        categories(id, name, slug)
      `)
      .single();

    if (prodError || !product) {
      return { data: null, error: prodError?.message || 'Failed to create product.' };
    }

    const productId = product.id;
    let variants: AdminProductVariant[] = [];
    let images: AdminProductImage[] = [];

    if (input.variants && input.variants.length > 0) {
      const variantRows = input.variants.map((v) => ({
        product_id: productId,
        color: v.color.trim(),
        color_hex: v.color_hex.trim(),
        size: v.size.trim(),
        sku: v.sku.trim(),
        stock: Number(v.stock || 0),
      }));

      const { data: vData, error: vError } = await supabaseBrowserClient
        .from('product_variants')
        .insert(variantRows)
        .select('id, color, color_hex, size, sku, stock');

      if (!vError && vData) {
        variants = vData as AdminProductVariant[];
      }
    }

    if (input.images && input.images.length > 0) {
      const imageRows = input.images.map((img, idx) => ({
        product_id: productId,
        image_url: img.image_url.trim(),
        sort_order: img.sort_order ?? idx,
        is_primary: img.is_primary ?? (idx === 0),
      }));

      const { data: imgData, error: imgError } = await supabaseBrowserClient
        .from('product_images')
        .insert(imageRows)
        .select('id, image_url, sort_order, is_primary');

      if (!imgError && imgData) {
        images = imgData as AdminProductImage[];
      }
    }

    const createdProduct: AdminProductItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? null,
      material: product.material ?? null,
      price: Number(product.price),
      discount: Number(product.discount || 0),
      status: product.status,
      category_id: product.category_id,
      categories: (Array.isArray(product.categories) ? product.categories[0] : product.categories) as unknown as { id: string; name: string; slug: string } | null,
      size_chart_id: product.size_chart_id ?? null,
      collections: Array.isArray(product.collections) ? product.collections : [],
      created_at: product.created_at,
      product_variants: variants,
      product_images: images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    };

    return { data: createdProduct, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product.';
    return { data: null, error: msg };
  }
}

export async function updateProduct(
  id: string,
  input: AdminProductUpdateInput
): Promise<{ data: AdminProductItem | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const updatePayload: Record<string, unknown> = {};

    if (input.name !== undefined) updatePayload.name = input.name.trim();
    if (input.slug !== undefined) updatePayload.slug = input.slug.trim();
    if (input.category_id !== undefined) updatePayload.category_id = input.category_id;
    if (input.price !== undefined) updatePayload.price = input.price;
    if (input.discount !== undefined) updatePayload.discount = input.discount ?? 0;
    if (input.status !== undefined) updatePayload.status = input.status;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.material !== undefined) updatePayload.material = input.material;
    if (input.size_chart_id !== undefined) updatePayload.size_chart_id = input.size_chart_id;
    if (input.collections !== undefined) updatePayload.collections = input.collections ?? [];

    const { data: product, error: prodError } = await supabaseBrowserClient
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        id,
        name,
        slug,
        description,
        material,
        price,
        discount,
        status,
        category_id,
        size_chart_id,
        collections,
        created_at,
        categories(id, name, slug)
      `)
      .single();

    if (prodError || !product) {
      return { data: null, error: prodError?.message || 'Failed to update product.' };
    }

    let variants: AdminProductVariant[] = [];
    let images: AdminProductImage[] = [];

    if (input.variants !== undefined) {
      await supabaseBrowserClient.from('product_variants').delete().eq('product_id', id);

      if (input.variants.length > 0) {
        const variantRows = input.variants.map((v) => ({
          product_id: id,
          color: v.color.trim(),
          color_hex: v.color_hex.trim(),
          size: v.size.trim(),
          sku: v.sku.trim(),
          stock: Number(v.stock || 0),
        }));

        const { data: vData } = await supabaseBrowserClient
          .from('product_variants')
          .insert(variantRows)
          .select('id, color, color_hex, size, sku, stock');

        if (vData) variants = vData as AdminProductVariant[];
      }
    } else {
      const { data: vData } = await supabaseBrowserClient
        .from('product_variants')
        .select('id, color, color_hex, size, sku, stock')
        .eq('product_id', id);
      if (vData) variants = vData as AdminProductVariant[];
    }

    if (input.images !== undefined) {
      await supabaseBrowserClient.from('product_images').delete().eq('product_id', id);

      if (input.images.length > 0) {
        const imageRows = input.images.map((img, idx) => ({
          product_id: id,
          image_url: img.image_url.trim(),
          sort_order: img.sort_order ?? idx,
          is_primary: img.is_primary ?? (idx === 0),
        }));

        const { data: imgData } = await supabaseBrowserClient
          .from('product_images')
          .insert(imageRows)
          .select('id, image_url, sort_order, is_primary');

        if (imgData) images = imgData as AdminProductImage[];
      }
    } else {
      const { data: imgData } = await supabaseBrowserClient
        .from('product_images')
        .select('id, image_url, sort_order, is_primary')
        .eq('product_id', id);
      if (imgData) images = imgData as AdminProductImage[];
    }

    const updatedProduct: AdminProductItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? null,
      material: product.material ?? null,
      price: Number(product.price),
      discount: Number(product.discount || 0),
      status: product.status,
      category_id: product.category_id,
      categories: (Array.isArray(product.categories) ? product.categories[0] : product.categories) as unknown as { id: string; name: string; slug: string } | null,
      size_chart_id: product.size_chart_id ?? null,
      collections: Array.isArray(product.collections) ? product.collections : [],
      created_at: product.created_at,
      product_variants: variants,
      product_images: images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    };

    return { data: updatedProduct, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update product.';
    return { data: null, error: msg };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete product.';
    return { success: false, error: msg };
  }
}

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `products/${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabaseBrowserClient.storage
      .from('pleatsssi-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabaseBrowserClient.storage
      .from('pleatsssi-assets')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload image.';
    return { url: null, error: msg };
  }
}
