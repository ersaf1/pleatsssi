import { expect, test, vi, beforeEach, afterEach, describe } from 'vitest';
import { getDynamicInfoPage } from '../src/lib/services/infoPageService';
import { getDynamicBanners } from '../src/lib/services/bannerService';
import { getDynamicCategories } from '../src/lib/services/categoryService';
import { getDynamicProducts } from '../src/lib/services/productService';
import { supabaseBrowserClient } from '../src/lib/supabaseClient';

test('info page service returns fallback when DB error or unconfigured occurs', async () => {
  const page = await getDynamicInfoPage('faq');
  expect(page).toBeDefined();
  expect(page?.title).toBeDefined();
});

test('banner service returns empty array fallback when DB error or unconfigured occurs', async () => {
  const banners = await getDynamicBanners();
  expect(Array.isArray(banners)).toBe(true);
});

test('category service returns fallback static categories when DB error or unconfigured occurs', async () => {
  const categories = await getDynamicCategories();
  expect(categories.length).toBeGreaterThan(0);
});

test('product service returns fallback static products when DB error or unconfigured occurs', async () => {
  const products = await getDynamicProducts();
  expect(products.length).toBeGreaterThan(0);
  expect(products[0].priceValue).toBeGreaterThan(0);
});

describe('Dynamic Services with configured Supabase', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid-test-url.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid-test-key-12345';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    vi.restoreAllMocks();
  });

  test('info page service returns DB data when configured and found', async () => {
    const mockData = { id: '1', slug: 'faq', title: 'DB FAQ Title', content: 'DB FAQ Content' };
    vi.spyOn(supabaseBrowserClient, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockData, error: null })
        })
      })
    } as unknown as ReturnType<typeof supabaseBrowserClient.from>);

    const page = await getDynamicInfoPage('faq');
    expect(page).toEqual(mockData);
  });

  test('banner service returns DB banners when configured', async () => {
    const mockBanners = [
      { id: 'b1', type: 'hero', title: 'Hero Banner', subtitle: 'Sub', image_url_desktop: '/img.png', image_url_mobile: '/m.png', cta_label: 'Shop', cta_url: '/shop', sort_order: 1, is_active: true }
    ];
    vi.spyOn(supabaseBrowserClient, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockBanners, error: null })
        })
      })
    } as unknown as ReturnType<typeof supabaseBrowserClient.from>);

    const banners = await getDynamicBanners();
    expect(banners).toEqual(mockBanners);
  });

  test('category service returns DB categories when configured', async () => {
    const mockCategories = [
      { id: 'c1', name: 'Atasan DB', slug: 'tops', description: 'Atasan' }
    ];
    vi.spyOn(supabaseBrowserClient, 'from').mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: mockCategories, error: null })
      })
    } as unknown as ReturnType<typeof supabaseBrowserClient.from>);

    const categories = await getDynamicCategories();
    expect(categories).toEqual(mockCategories);
  });

  test('product service maps DB product, calculates original price, and sorts images correctly', async () => {
    const mockDbProducts = [
      {
        id: 'p1',
        name: 'Pleated Shirt',
        slug: 'pleated-shirt',
        description: 'Nice shirt',
        material: 'Polyester',
        price: 500000,
        discount: 10,
        status: 'published',
        categories: { id: 'c1', name: 'Tops', slug: 'tops' },
        product_variants: [
          { id: 'v1', color: 'Black', color_hex: '#000000', size: 'M', sku: 'SKU1', stock: 5 }
        ],
        product_images: [
          { id: 'i2', image_url: '/hover.jpg', sort_order: 2, is_primary: false },
          { id: 'i1', image_url: '/primary.jpg', sort_order: 1, is_primary: true }
        ]
      }
    ];

    vi.spyOn(supabaseBrowserClient, 'from').mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({ data: mockDbProducts, error: null }),
      })
    } as unknown as ReturnType<typeof supabaseBrowserClient.from>);

    const products = await getDynamicProducts();
    expect(products.length).toBe(1);
    // service maps id to slug || id
    expect(products[0].id).toBe('pleated-shirt');
    expect(products[0].name).toBe('Pleated Shirt');
    expect(products[0].color).toBe('Black');
    expect(products[0].price).toBe('IDR500,000');
    // Original price calculation: 500000 / (1 - 0.10) = 555,555.55... -> IDR555,556
    expect(products[0].originalPrice).toBe('IDR555,556');
    expect(products[0].discount).toBe('10% OFF');
    expect(products[0].priceValue).toBe(500000);
    expect(products[0].image).toBe('/primary.jpg');
    expect(products[0].hoverImage).toBe('/hover.jpg');
    expect(products[0].gallery).toEqual(['/primary.jpg', '/hover.jpg']);
    expect(products[0].category).toBe('tops');
    expect(products[0].isSale).toBe(true);
    expect(products[0].pdpUrl).toBe('/id/products/pleated-shirt');
  });
});
