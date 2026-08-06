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
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Layers,
  Database,
  ArrowRight,
  TrendingUp,
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

  const [categoriesList, setCategoriesList] = useState<any[]>([]);

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
      let cats: any[] = Object.entries(CATEGORY_META).map(([slug, cat]) => ({
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
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E0D8] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1918]">
              Dashboard Overview
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                stats.isLiveDb
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {stats.isLiveDb ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Live Database
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" /> Static Fallback Mode
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-[#706D65] mt-1">
            Welcome to Pleatsssi administration console. Monitor store statistics and catalog data.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            disabled={stats.loading}
            className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-[#1A1918] bg-white border border-[#E5E0D8] rounded-lg hover:bg-[#FAF7F2] transition-colors disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${stats.loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/id"
            target="_blank"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-[#0B4F3A] rounded-lg hover:bg-[#083C2C] transition-colors shadow-xs"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Stat Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#706D65]">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl text-[#1A1918]">
              {stats.productsCount}
            </span>
            <Link
              href="/id/admin/products"
              className="text-xs font-semibold text-[#0B4F3A] hover:underline flex items-center"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <p className="text-xs text-[#706D65] mt-2">Active catalog items</p>
        </div>

        {/* Categories Stat Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#706D65]">
              Categories
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl text-[#1A1918]">
              {stats.categoriesCount}
            </span>
            <Link
              href="/id/admin/categories"
              className="text-xs font-semibold text-[#0B4F3A] hover:underline flex items-center"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <p className="text-xs text-[#706D65] mt-2">Storefront categories & subcategories</p>
        </div>

        {/* Orders Stat Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#706D65]">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl text-[#1A1918]">
              {stats.ordersCount}
            </span>
            <Link
              href="/id/admin/orders"
              className="text-xs font-semibold text-[#0B4F3A] hover:underline flex items-center"
            >
              View Orders <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <p className="text-xs text-[#706D65] mt-2">Customer purchases logged</p>
        </div>

        {/* Active Banners Stat Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-xs relative overflow-hidden group hover:border-[#0B4F3A]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#706D65]">
              Active Banners
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif font-bold text-3xl text-[#1A1918]">
              {stats.bannersCount}
            </span>
            <Link
              href="/id/admin/banners"
              className="text-xs font-semibold text-[#0B4F3A] hover:underline flex items-center"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <p className="text-xs text-[#706D65] mt-2">Hero & lifestyle banners</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-xl text-[#1A1918]">Catalog & Operations Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Products */}
          <Link
            href="/id/admin/products"
            className="group bg-white p-6 rounded-xl border border-[#E5E0D8] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Products & Variants
              </h3>
              <p className="text-xs text-[#706D65] mt-1 line-clamp-2">
                Manage product details, pricing, discount rates, swatches, stock, and gallery uploads.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center text-xs font-semibold text-[#0B4F3A]">
              Open Products Panel <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Categories */}
          <Link
            href="/id/admin/categories"
            className="group bg-white p-6 rounded-xl border border-[#E5E0D8] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <FolderTree className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Category CRUD
              </h3>
              <p className="text-xs text-[#706D65] mt-1 line-clamp-2">
                Create, edit, and delete storefront categories with image icon uploads to pleatsssi-assets.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center text-xs font-semibold text-[#0B4F3A]">
              Open Categories Panel <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Banners */}
          <Link
            href="/id/admin/banners"
            className="group bg-white p-6 rounded-xl border border-[#E5E0D8] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Banners & Hero
              </h3>
              <p className="text-xs text-[#706D65] mt-1 line-clamp-2">
                Configure hero banner sliders, mobile/desktop banner assets, and seasonal promotional CTAs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center text-xs font-semibold text-[#0B4F3A]">
              Open Banners Panel <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Orders */}
          <Link
            href="/id/admin/orders"
            className="group bg-white p-6 rounded-xl border border-[#E5E0D8] hover:border-[#0B4F3A] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] group-hover:bg-[#0B4F3A] group-hover:border-[#0B4F3A] group-hover:text-white text-[#0B4F3A] flex items-center justify-center transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918] mt-4 group-hover:text-[#0B4F3A] transition-colors">
                Order Fulfillment
              </h3>
              <p className="text-xs text-[#706D65] mt-1 line-clamp-2">
                Track customer orders, update shipping statuses, add courier tracking numbers, and view invoices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center text-xs font-semibold text-[#0B4F3A]">
              Open Orders Panel <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Category Summary List & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Preview Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E0D8] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">Active Categories</h3>
              <p className="text-xs text-[#706D65]">Summary of catalog groupings active on storefront</p>
            </div>
            <Link
              href="/id/admin/categories"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#0B4F3A] px-3 py-1.5 rounded-lg hover:bg-[#083C2C] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1918]">
              <thead className="bg-[#FAF7F2] text-[#706D65] uppercase tracking-wider font-semibold border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {categoriesList.map((cat, idx) => (
                  <tr key={cat.id || cat.slug || idx} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#1A1918]">{cat.name}</td>
                    <td className="py-3 px-3 font-mono text-[#0B4F3A]">/id/{cat.slug}</td>
                    <td className="py-3 px-3 text-[#706D65] max-w-xs truncate">{cat.description || '-'}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/id/admin/categories"
                        className="text-[#0B4F3A] hover:underline font-medium"
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
        <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#E5E0D8] pb-3 mb-4">
              <Database className="w-5 h-5 text-[#0B4F3A]" />
              <h3 className="font-serif font-bold text-lg text-[#1A1918]">System Status</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E5E0D8]">
                <span className="text-xs font-semibold text-[#706D65] uppercase block">Storage Bucket</span>
                <span className="text-sm font-bold text-[#1A1918] mt-0.5 block">pleatsssi-assets</span>
                <p className="text-[11px] text-[#706D65] mt-1">Public access bucket configured for products, banners, and categories.</p>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E5E0D8]">
                <span className="text-xs font-semibold text-[#706D65] uppercase block">Database Mode</span>
                <div className="flex items-center mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${stats.isLiveDb ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-sm font-bold text-[#1A1918]">
                    {stats.isLiveDb ? 'Supabase Live Connected' : 'Static Fallback Mode'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E0D8] mt-6">
            <p className="text-[11px] text-[#706D65]">
              PLEATSSSI Admin Console v1.0 • All actions are logged and authenticated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
