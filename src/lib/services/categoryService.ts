import { supabaseBrowserClient } from '../supabaseClient';
import { CATEGORY_META } from '@/data/categories';
import { isSupabaseConfigured, withTimeout } from './serviceUtils';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  created_at?: string;
}

export async function getDynamicCategories(): Promise<CategoryItem[]> {
  const fallback: CategoryItem[] = Object.entries(CATEGORY_META).map(([key, meta]) => ({
    id: key,
    name: meta.title || key,
    slug: meta.slug || key,
    description: meta.description || '',
    image_url: null,
    parent_id: null,
  }));

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const { data, error } = await withTimeout(
      supabaseBrowserClient
        .from('categories')
        .select('*')
        .order('name')
    );
    
    if (error || !data || data.length === 0) {
      return fallback;
    }
    return data as CategoryItem[];
  } catch {
    return fallback;
  }
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
}): Promise<{ data: CategoryItem | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const { data, error } = await supabaseBrowserClient
      .from('categories')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url || null,
        parent_id: input.parent_id || null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CategoryItem, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create category.';
    return { data: null, error: msg };
  }
}

export async function updateCategory(
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    parent_id?: string | null;
  }
): Promise<{ data: CategoryItem | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  try {
    const { data, error } = await supabaseBrowserClient
      .from('categories')
      .update({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.image_url !== undefined && { image_url: input.image_url }),
        ...(input.parent_id !== undefined && { parent_id: input.parent_id }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as CategoryItem, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update category.';
    return { data: null, error: msg };
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseBrowserClient
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete category.';
    return { success: false, error: msg };
  }
}

export async function uploadCategoryImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `categories/${Date.now()}_${cleanFileName}.${fileExt}`;

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

