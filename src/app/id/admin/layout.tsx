'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
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
  ShieldCheck,
} from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-[#E5E0D8] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#0B4F3A]" />
          <span className="font-serif font-bold text-lg text-[#1A1918]">PLEATSSSI Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#1A1918] hover:bg-[#FAF7F2] rounded-lg"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E0D8] flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-[#E5E0D8] flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B4F3A] flex items-center justify-center text-white font-serif font-bold text-lg">
              P
            </div>
            <div>
              <h1 className="font-serif font-bold text-base text-[#1A1918] tracking-tight">
                PLEATSSSI
              </h1>
              <p className="text-[11px] font-semibold tracking-wider text-[#0B4F3A] uppercase">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0B4F3A] text-white shadow-xs'
                      : 'text-[#4A4741] hover:bg-[#F2ECE1] hover:text-[#0B4F3A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#706D65]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User & Logout */}
        <div className="p-4 border-t border-[#E5E0D8] space-y-3">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0B4F3A]/10 text-[#0B4F3A] flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#1A1918] truncate">Administrator</p>
              <p className="text-[11px] text-[#706D65] truncate">admin@pleatsssi.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
