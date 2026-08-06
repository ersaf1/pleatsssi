import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
  MOCK_BANNERS,
} from '../src/lib/services/bannerService';

import {
  getAllCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  MOCK_COUPONS,
} from '../src/lib/services/couponService';

import {
  getAllInfoPages,
  getDynamicInfoPage,
  createOrUpdateInfoPage,
  deleteInfoPage,
} from '../src/lib/services/infoPageService';

import {
  getAdminOrders,
  updateOrderFulfillment,
  deleteOrder,
  MOCK_ORDERS,
} from '../src/lib/services/orderService';

describe('Task 8: Banners, Coupons, Info Pages, & Orders Services', () => {
  test('File existence check for Task 8 Admin Pages', () => {
    const bannersPage = path.join(process.cwd(), 'src/app/id/admin/banners/page.tsx');
    const couponsPage = path.join(process.cwd(), 'src/app/id/admin/coupons/page.tsx');
    const infoPagesPage = path.join(process.cwd(), 'src/app/id/admin/info-pages/page.tsx');
    const ordersPage = path.join(process.cwd(), 'src/app/id/admin/orders/page.tsx');

    expect(fs.existsSync(bannersPage)).toBe(true);
    expect(fs.existsSync(couponsPage)).toBe(true);
    expect(fs.existsSync(infoPagesPage)).toBe(true);
    expect(fs.existsSync(ordersPage)).toBe(true);
  });

  describe('Banner Service', () => {
    test('getAllBanners returns static fallback when Supabase is unconfigured', async () => {
      const banners = await getAllBanners();
      expect(Array.isArray(banners)).toBe(true);
      expect(banners.length).toBe(MOCK_BANNERS.length);
      expect(banners[0]).toHaveProperty('type');
      expect(banners[0]).toHaveProperty('image_url_desktop');
    });

    test('createBanner & updateBanner handle option clearing (setting empty optional fields to null)', async () => {
      const createRes = await createBanner({
        type: 'hero',
        title: '   ',
        subtitle: 'Valid Subtitle',
        image_url_desktop: '/images/hero.png',
        image_url_mobile: '/images/hero-mob.png',
        cta_label: '',
        cta_url: '',
      });
      expect(createRes).toHaveProperty('error');

      const updateRes = await updateBanner('mock-id', {
        title: '  ',
        subtitle: null,
      });
      expect(updateRes).toHaveProperty('error');
    });

    test('deleteBanner & uploadBannerImage return expected responses when unconfigured', async () => {
      const delRes = await deleteBanner('mock-id');
      expect(delRes.success).toBe(false);

      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      const res = await uploadBannerImage(file);
      expect(res.url).toBeNull();
      expect(res.error).toBe('Supabase is not configured.');
    });
  });

  describe('Coupon Service', () => {
    test('getAllCoupons & getCouponByCode return fallback mock data when unconfigured', async () => {
      const coupons = await getAllCoupons();
      expect(coupons.length).toBe(MOCK_COUPONS.length);
      expect(coupons[0].code).toBe('WELCOME10');

      const found = await getCouponByCode('welcome10');
      expect(found).not.toBeNull();
      expect(found?.code).toBe('WELCOME10');
    });

    test('createCoupon, updateCoupon & deleteCoupon handle operations safely', async () => {
      const createRes = await createCoupon({
        code: 'TEST20',
        type: 'percentage',
        value: 20,
        starts_at: new Date().toISOString(),
        expires_at: new Date().toISOString(),
      });
      expect(createRes.error).toBe('Supabase is not configured.');

      const res = await updateCoupon('c1111111-1111-1111-1111-111111111111', {
        max_discount: null,
        quota: null,
      });
      expect(res.error).toBe('Supabase is not configured.');

      const delRes = await deleteCoupon('c1111111-1111-1111-1111-111111111111');
      expect(delRes.success).toBe(false);
    });
  });

  describe('Info Page Service', () => {
    test('getAllInfoPages & getDynamicInfoPage return static info pages fallback', async () => {
      const pages = await getAllInfoPages();
      expect(pages.length).toBeGreaterThan(0);
      expect(pages.some((p) => p.slug === 'faq')).toBe(true);

      const dynamicPage = await getDynamicInfoPage('faq');
      expect(dynamicPage).not.toBeNull();
      expect(dynamicPage?.title).toBeDefined();
    });

    test('createOrUpdateInfoPage & deleteInfoPage handle unconfigured state', async () => {
      const res = await createOrUpdateInfoPage({
        slug: '  NEW-INFO-PAGE  ',
        title: 'New Info Page',
        content: 'Sample content',
      });
      expect(res.error).toBe('Supabase is not configured.');

      const delRes = await deleteInfoPage('mock-info-id');
      expect(delRes.success).toBe(false);
    });
  });

  describe('Order Service', () => {
    test('getAdminOrders returns static mock orders when unconfigured', async () => {
      const orders = await getAdminOrders();
      expect(orders.length).toBe(MOCK_ORDERS.length);
      expect(orders[0]).toHaveProperty('order_number');
      expect(orders[0]).toHaveProperty('shipping_address');
      expect(orders[0]).toHaveProperty('order_items');
    });

    test('updateOrderFulfillment & deleteOrder handle option clearing and deletion', async () => {
      const res = await updateOrderFulfillment('ord-1001-mock-uuid-0001', {
        status: 'shipped',
        tracking_number: '   ',
        notes: '',
      });
      expect(res.error).toBe('Supabase is not configured.');

      const delRes = await deleteOrder('ord-1001-mock-uuid-0001');
      expect(delRes.success).toBe(false);
    });
  });
});
