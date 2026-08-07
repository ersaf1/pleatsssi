import { headers } from 'next/headers';
import { Header, type NavItem } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getDynamicCategories } from '@/lib/services/categoryService';

/** Build nav items from DB categories, keeping special non-category routes pinned. */
async function buildNavItems(): Promise<NavItem[]> {
  const PINNED_BEFORE: NavItem[] = [
    { label: 'PRODUK BARU', href: '/id/new-arrivals' },
  ];
  const PINNED_AFTER: NavItem[] = [
    { label: 'STORIES', href: '/id/press/editorials' },
    { label: 'SALE', href: '/id/sale', isSale: true },
  ];

  try {
    const categories = await getDynamicCategories();
    // Only show categories that are meant for navigation (exclude meta-only ones)
    const NAV_SLUGS = ['skirts', 'tops', 'pants', 'trending-now'];
    const categoryItems: NavItem[] = categories
      .filter((c) => NAV_SLUGS.includes(c.slug))
      .sort((a, b) => NAV_SLUGS.indexOf(a.slug) - NAV_SLUGS.indexOf(b.slug))
      .map((c) => ({ label: c.name.toUpperCase(), href: `/id/${c.slug}` }));

    return [...PINNED_BEFORE, ...categoryItems, ...PINNED_AFTER];
  } catch {
    // Fallback to static defaults on any error
    return [
      { label: 'PRODUK BARU', href: '/id/new-arrivals' },
      { label: 'ROK', href: '/id/skirts' },
      { label: 'ATASAN', href: '/id/tops' },
      { label: 'CELANA', href: '/id/pants' },
      { label: 'TRENDING NOW', href: '/id/trending-now' },
      { label: 'STORIES', href: '/id/press/editorials' },
      { label: 'SALE', href: '/id/sale', isSale: true },
    ];
  }
}

export default async function IdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Skip public Header/Footer for all admin routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? '';
  const isAdminRoute = pathname.startsWith('/id/admin');
  if (isAdminRoute) {
    return <>{children}</>;
  }

  const navItems = await buildNavItems();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1918] flex flex-col font-sans antialiased">
      <Header navItems={navItems} />
      <main className="flex-1 bg-[#FAF7F2] text-[#1A1918]">{children}</main>
      <Footer />
    </div>
  );
}
