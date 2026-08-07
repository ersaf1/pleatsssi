'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  ShoppingBag,
  ImageIcon,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';
import { isSupabaseConfigured } from '@/lib/services/serviceUtils';
import { PRODUCTS } from '@/data/products';
import { CATEGORY_META } from '@/data/categories';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productsCount: PRODUCTS.length,
    categoriesCount: Object.keys(CATEGORY_META).length,
    ordersCount: 0,
    bannersCount: 3,
    isLiveDb: false,
    loading: true,
  });

  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string; slug: string; description?: string }>>([]);

  const loadDashboardData = async () => {
    setStats((prev) => ({ ...prev, loading: true }));

    if (!isSupabaseConfigured()) {
      setStats({
        productsCount: PRODUCTS.length,
        categoriesCount: Object.keys(CATEGORY_META).length,
        ordersCount: 0,
        bannersCount: 3,
        isLiveDb: false,
        loading: false,
      });
      setCategoriesList(
        Object.entries(CATEGORY_META).map(([slug, cat]) => ({
          id: slug,
          name: cat.title,
          slug: slug,
          description: cat.description,
        })).slice(0, 6)
      );
      return;
    }

    try {
      const [prodRes, catRes, ordRes, banRes] = await Promise.allSettled([
        supabaseBrowserClient.from('products').select('id', { count: 'exact', head: true }),
        supabaseBrowserClient.from('categories').select('*').order('name'),
        supabaseBrowserClient.from('orders').select('id', { count: 'exact', head: true }),
        supabaseBrowserClient.from('banners').select('id', { count: 'exact', head: true }),
      ]);

      const prodCount =
        prodRes.status === 'fulfilled' && prodRes.value.count !== null
          ? prodRes.value.count
          : PRODUCTS.length;

      let catCount = Object.keys(CATEGORY_META).length;
      let cats: Array<{ id: string; name: string; slug: string; description?: string }> = Object.entries(CATEGORY_META).map(([slug, cat]) => ({
        id: slug,
        name: cat.title,
        slug: slug,
        description: cat.description,
      }));

      if (catRes.status === 'fulfilled' && catRes.value.data && catRes.value.data.length > 0) {
        catCount = catRes.value.data.length;
        cats = catRes.value.data;
      }

      const ordCount =
        ordRes.status === 'fulfilled' && ordRes.value.count !== null ? ordRes.value.count : 0;
      const banCount =
        banRes.status === 'fulfilled' && banRes.value.count !== null ? banRes.value.count : 3;

      setStats({
        productsCount: prodCount,
        categoriesCount: catCount,
        ordersCount: ordCount,
        bannersCount: banCount,
        isLiveDb: true,
        loading: false,
      });
      setCategoriesList(cats.slice(0, 6));
    } catch {
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0F172A]">
              Dashboard Overview
            </h1>
            <span
              className={
                stats.isLiveDb
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-xs'
              }
            >
              {stats.isLiveDb ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live Database</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Static Fallback Mode</span>
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-[#475569] mt-1">
            Welcome to Pleatsssi administration console. Monitor store statistics and catalog data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={stats.loading}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 text-[#0B4F3A] ${stats.loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/id"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0B4F3A] rounded-xl hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Stat Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Total Products
            </span>
            <div className="w-11 h-11 rounded-xl bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#0F172A]">
              {stats.productsCount}
            </span>
            <Link
              href="/id/admin/products"
              className="text-xs font-bold text-[#0B4F3A] hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-[#64748B] mt-2">Active catalog items</p>
        </div>

        {/* Categories Stat Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Categories
            </span>
            <div className="w-11 h-11 rounded-xl bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#0F172A]">
              {stats.categoriesCount}
            </span>
            <Link
              href="/id/admin/categories"
              className="text-xs font-bold text-[#0B4F3A] hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-[#64748B] mt-2">Storefront categories & subcategories</p>
        </div>

        {/* Orders Stat Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Total Orders
            </span>
            <div className="w-11 h-11 rounded-xl bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#0F172A]">
              {stats.ordersCount}
            </span>
            <Link
              href="/id/admin/orders"
              className="text-xs font-bold text-[#0B4F3A] hover:underline flex items-center gap-0.5"
            >
              <span>View Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-[#64748B] mt-2">Customer purchases logged</p>
        </div>

        {/* Active Banners Stat Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Active Banners
            </span>
            <div className="w-11 h-11 rounded-xl bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl sm:text-4xl text-[#0F172A]">
              {stats.bannersCount}
            </span>
            <Link
              href="/id/admin/banners"
              className="text-xs font-bold text-[#0B4F3A] hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-[#64748B] mt-2">Hero & lifestyle banners</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-xl text-[#0F172A]">Catalog & Operations Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Products */}
          <Link
            href="/id/admin/products"
            className="group bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0F172A] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Products & Variants
              </h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                Manage product details, pricing, discount rates, swatches, stock, and gallery uploads.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#0B4F3A]">
              <span>Open Products Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Categories */}
          <Link
            href="/id/admin/categories"
            className="group bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <FolderTree className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0F172A] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Category CRUD
              </h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                Create, edit, and delete storefront categories with image icon uploads to pleatsssi-assets.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#0B4F3A]">
              <span>Open Categories Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Banners */}
          <Link
            href="/id/admin/banners"
            className="group bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0F172A] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Banners & Hero
              </h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                Configure hero banner sliders, mobile/desktop banner assets, and seasonal promotional CTAs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#0B4F3A]">
              <span>Open Banners Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Orders */}
          <Link
            href="/id/admin/orders"
            className="group bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0F172A] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Order Fulfillment
              </h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                Track customer orders, update shipping statuses, add courier tracking numbers, and view invoices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#0B4F3A]">
              <span>Open Orders Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Category Summary List & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Preview Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0F172A]">Active Categories</h3>
              <p className="text-xs text-[#64748B]">Summary of catalog groupings active on storefront</p>
            </div>
            <Link
              href="/id/admin/categories"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#0B4F3A] px-3.5 py-2 rounded-xl hover:bg-[#083C2C] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F172A]">
              <thead className="bg-[#F8FAFC] text-[#475569] uppercase text-[11px] tracking-wider font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Slug</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {categoriesList.map((cat, idx) => (
                  <tr key={cat.id || cat.slug || idx} className="hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                    <td className="py-3.5 px-3 font-semibold text-[#0F172A]">{cat.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-medium text-[#0B4F3A] bg-[#0B4F3A]/10 px-2 py-0.5 rounded-md">
                        /id/{cat.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B] max-w-xs truncate">{cat.description || '-'}</td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/id/admin/categories"
                        className="text-[#0B4F3A] hover:underline font-bold text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Database Connection Status */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-3 mb-4">
              <Database className="w-5 h-5 text-[#0B4F3A]" />
              <h3 className="font-serif font-bold text-lg text-[#0F172A]">System Status</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">Storage Bucket</span>
                <span className="text-sm font-bold text-[#0F172A] mt-1 block">pleatsssi-assets</span>
                <p className="text-[11px] text-[#64748B] mt-1">Public access bucket configured for products, banners, and categories.</p>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">Database Mode</span>
                <div className="flex items-center mt-2">
                  <span
                    className={
                      stats.isLiveDb
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1.5'
                        : 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1.5'
                    }
                  >
                    <span className={`w-2 h-2 rounded-full ${stats.isLiveDb ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {stats.isLiveDb ? 'Supabase Live Connected' : 'Static Fallback Mode'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] mt-6">
            <p className="text-[11px] text-[#64748B]">
              PLEATSSSI Admin Console v1.0 • All actions are logged and authenticated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
