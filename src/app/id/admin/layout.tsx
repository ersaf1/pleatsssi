'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  Ticket,
  FileText,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { supabaseBrowserClient } from '@/lib/supabaseClient';

const navItems = [
  { href: '/id/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/id/admin/products', label: 'Products', icon: Package },
  { href: '/id/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/id/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/id/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/id/admin/info-pages', label: 'Info Pages', icon: FileText },
  { href: '/id/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string }>({
    name: 'Administrator',
    email: 'admin@pleatsssi.com',
  });

  useEffect(() => {
    if (pathname !== '/id/admin/login') {
      supabaseBrowserClient.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const userMeta = data.user.user_metadata;
          const name = userMeta?.name || userMeta?.full_name || data.user.email?.split('@')[0] || 'Administrator';
          const email = data.user.email || 'admin@pleatsssi.com';
          setUserProfile({ name, email });
        }
      });
    }
  }, [pathname]);

  // If viewing the login page, render children directly without the admin layout shell
  if (pathname === '/id/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/id/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = userProfile.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AD';

  const currentNavItem = navItems.find((item) => pathname.startsWith(item.href));
  const pageTitle = currentNavItem ? currentNavItem.label : pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0B4F3A] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
            P
          </div>
          <div>
            <span className="font-serif font-bold text-base text-[#0F172A]">PLEATSSSI</span>
            <span className="ml-2 text-[10px] font-bold tracking-widest text-[#0B4F3A] uppercase bg-[#0B4F3A]/10 px-2 py-0.5 rounded-full">
              ADMIN
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3A] flex items-center justify-center text-white font-serif font-bold text-xl shadow-xs">
              P
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-[#0F172A] tracking-tight">
                PLEATSSSI
              </h1>
              <span className="inline-block text-[10px] font-bold tracking-widest text-[#0B4F3A] uppercase bg-[#0B4F3A]/10 px-2 py-0.5 rounded-full">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-[#0B4F3A] text-white shadow-xs font-semibold rounded-xl border-l-4 border-[#0B4F3A]'
                      : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0B4F3A] font-medium rounded-xl'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User & Logout */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-3 bg-[#F8FAFC]">
          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#0B4F3A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0F172A] truncate">{userProfile.name}</p>
              <p className="text-[11px] text-[#64748B] truncate">{userProfile.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-rose-600 hover:bg-rose-50 rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2.5 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Content Container with Topbar */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop Topbar Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E2E8F0] px-6 lg:px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-medium text-[#64748B]">
            <span className="text-[#0F172A] font-semibold">Admin</span>
            <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            <span className="text-[#0B4F3A] font-semibold capitalize">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-medium text-[#0B4F3A]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Admin Session Active</span>
            </div>

            <Link
              href="/id"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] hover:text-[#0B4F3A] hover:bg-[#F1F5F9] rounded-lg transition-colors border border-[#E2E8F0]"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

