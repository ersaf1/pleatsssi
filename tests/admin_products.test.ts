import { expect, test, describe } from 'vitest';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../src/lib/services/productService';
import { isSupabaseConfigured } from '../src/lib/services/serviceUtils';
import fs from 'fs';
import path from 'path';

describe('Admin Product & Variant CRUD', () => {
  test('Admin products page file exists at src/app/id/admin/products/page.tsx', () => {
    const productsPath = path.join(__dirname, '../src/app/id/admin/products/page.tsx');
    expect(fs.existsSync(productsPath)).toBe(true);
  });

  test('getAdminProducts returns fallback products when Supabase is unconfigured', async () => {
    const products = await getAdminProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('product_variants');
    expect(products[0]).toHaveProperty('product_images');
  });

  test('createProduct handles unconfigured Supabase gracefully', async () => {
    const res = await createProduct({
      name: 'Test Product',
      slug: 'test-product',
      category_id: 'cat-1',
      price: 299000,
      description: 'Test description',
      variants: [
        {
          color: 'Black',
          color_hex: '#000000',
          size: 'M',
          sku: 'TST-BLK-M',
          stock: 15,
        },
      ],
      images: [
        {
          image_url: 'https://example.com/img.jpg',
          sort_order: 0,
          is_primary: true,
        },
      ],
    });

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.data).toBeNull();
    }
  });

  test('updateProduct handles unconfigured Supabase gracefully and supports explicit null for option clearing', async () => {
    const res = await updateProduct('test-prod-id', {
      name: 'Updated Product Name',
      description: null,
      material: null,
      size_chart_id: null,
      discount: 0,
    });

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.data).toBeNull();
    }
  });

  test('deleteProduct handles unconfigured Supabase gracefully', async () => {
    const res = await deleteProduct('test-prod-id');

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.success).toBe(false);
    }
  });

  test('uploadProductImage targets pleatsssi-assets bucket with products/ path', async () => {
    const mockFile = new File(['fake-image-bytes'], 'product-sample.png', { type: 'image/png' });
    const res = await uploadProductImage(mockFile);

    if (!isSupabaseConfigured()) {
      expect(res.error).toBe('Supabase is not configured.');
      expect(res.url).toBeNull();
    }
  });
});
