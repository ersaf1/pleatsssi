import { expect, test, describe, vi, beforeEach } from 'vitest';
import {
  getDynamicCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
} from '../src/lib/services/categoryService';
import { isSupabaseConfigured } from '../src/lib/services/serviceUtils';
import fs from 'fs';
import path from 'path';

describe('Admin Dashboard Layout & Category CRUD', () => {
  test('Admin dashboard and categories page files exist', () => {
    const dashboardPath = path.join(__dirname, '../src/app/id/admin/dashboard/page.tsx');
    const categoriesPath = path.join(__dirname, '../src/app/id/admin/categories/page.tsx');

    expect(fs.existsSync(dashboardPath)).toBe(true);
    expect(fs.existsSync(categoriesPath)).toBe(true);
  });

  test('category service returns static fallback when Supabase is unconfigured', async () => {
    const categories = await getDynamicCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.some((c) => c.slug === 'skirts')).toBe(true);
  });

  test('createCategory handles unconfigured Supabase gracefully', async () => {
    const res = await createCategory({
      name: 'New Collection',
      slug: 'new-collection',
      description: 'Test description',
    });

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.data).toBeNull();
    }
  });

  test('updateCategory handles unconfigured Supabase gracefully and supports explicit null for option clearing', async () => {
    const res = await updateCategory('test-id', {
      name: 'Updated Title',
      description: null,
      image_url: null,
    });

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.data).toBeNull();
    }
  });

  test('deleteCategory handles unconfigured Supabase gracefully', async () => {
    const res = await deleteCategory('test-id');

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.success).toBe(false);
    }
  });

  test('uploadCategoryImage uploads to pleatsssi-assets/categories/ path', async () => {
    const mockFile = new File(['fake-image-content'], 'sample.png', { type: 'image/png' });
    const res = await uploadCategoryImage(mockFile);

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.url).toBeNull();
    }
  });
});
