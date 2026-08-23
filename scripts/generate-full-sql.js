const fs = require('fs');
const path = require('path');

const pleatsssiProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/pleatsssi-products.json'), 'utf8')
);

let sql = `-- ============================================================
-- PLEATSSSI COMPLETE SUPABASE SCHEMA & SEED SCRIPT
-- Copy and run this script in Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Size Charts Table
CREATE TABLE IF NOT EXISTS size_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  chart_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  size_chart_id UUID REFERENCES size_charts(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  material TEXT,
  price DECIMAL(12,2) NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  collections JSONB DEFAULT '["new-arrivals"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  size VARCHAR(10) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  stock INT NOT NULL DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('hero', 'promo', 'lifestyle')),
  title VARCHAR(150),
  subtitle VARCHAR(255),
  image_url_desktop TEXT NOT NULL,
  image_url_mobile TEXT NOT NULL,
  cta_label VARCHAR(100),
  cta_url VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Info Pages Table
CREATE TABLE IF NOT EXISTS info_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'percentage')),
  value DECIMAL(12,2) NOT NULL,
  min_purchase DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  max_discount DECIMAL(12,2),
  quota INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 year'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Enable Row Level Security (RLS) & Allow Public Read Access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on product_variants" ON product_variants FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on product_images" ON product_images FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on banners" ON banners FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on info_pages" ON info_pages FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on coupons" ON coupons FOR SELECT TO public USING (true);

-- Allow full access for service_role and authenticated users
CREATE POLICY "Allow full access for admin on categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on product_variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on product_images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on banners" ON banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on info_pages" ON info_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access for admin on coupons" ON coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. Seed Categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Skirts', 'skirts', 'Signature Pleated Skirts Collection'),
  ('c2000000-0000-0000-0000-000000000002', 'Tops', 'tops', 'Signature Pleated Tops Collection'),
  ('c3000000-0000-0000-0000-000000000003', 'Pants', 'pants', 'Signature Pleated Pants Collection'),
  ('c4000000-0000-0000-0000-000000000004', 'Others', 'others', 'Accessories & Special Pieces Collection')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

`;

// Add Seed Banners & Info Pages
sql += `
-- 12. Seed Initial Banners
INSERT INTO banners (type, title, subtitle, image_url_desktop, image_url_mobile, cta_label, cta_url, sort_order) VALUES
  ('hero', 'Koleksi Terbaru PLEATSSSI', 'Desain Pleats Mewah Bertekstur Haute-Couture', '/images/products/AGATE/AGATE TOP.jpg', '/images/products/AGATE/AGATE TOP.jpg', 'Jelajahi Koleksi', '/id/new-arrivals', 1),
  ('lifestyle', 'Pleated Skirts', 'Kemewahan Dalam Setiap Gerakan', '/images/products/RAIA ONE/RAIA SKIRT.jpg', '/images/products/RAIA ONE/RAIA SKIRT.jpg', 'Belanja Skirts', '/id/skirts', 1),
  ('lifestyle', 'Pleated Tops', 'Refined Silhouette & Timeless Elegance', '/images/products/AURORA ONE/AURORA TOP.jpg', '/images/products/AURORA ONE/AURORA TOP.jpg', 'Belanja Tops', '/id/tops', 2)
ON CONFLICT DO NOTHING;

-- 13. Seed Info Pages
INSERT INTO info_pages (slug, title, content) VALUES
  ('faq', 'Pertanyaan Umum (FAQ)', 'Selamat datang di halaman FAQ PLEATSSSI. Temukan jawaban seputar pemesanan, pengiriman, dan panduan perawatan pleated fashion kami.'),
  ('pengiriman-pelacakan', 'Pengiriman & Pelacakan', 'Layanan pengiriman PLEATSSSI mencakup seluruh wilayah Indonesia dengan estimasi pengiriman 2-5 hari kerja.'),
  ('pengembalian', 'Kebijakan Pengembalian', 'Pengembalian produk dapat dilakukan dalam waktu 7 hari setelah barang diterima.'),
  ('perawatan-produk', 'Panduan Perawatan Produk Pleats', 'Untuk menjaga tekstur lipatan (pleats) tetap tajam dan indah: Cuci dengan tangan menggunakan air dingin, jangan gunakan mesin pengering, dan gantung dengan rapi.'),
  ('lokasi-toko', 'Lokasi Toko', 'Kunjungi flagship store dan popup gallery PLEATSSSI di Jakarta, Bali, dan Surabaya.'),
  ('panduan-ukuran', 'Panduan Ukuran (Size Guide)', 'Produk PLEATSSSI dirancang dengan material pleated berkualitas tinggi yang fleksibel (All Size / Stretch).'),
  ('privacy-policy', 'Kebijakan Privasi', 'PLEATSSSI berkomitmen melindungi privasi data pribadi Anda.'),
  ('terms-of-use', 'Syarat & Ketentuan', 'Syarat dan ketentuan penggunaan situs web resmi PLEATSSSI Indonesia.'),
  ('cookies-policy', 'Kebijakan Cookies', 'Penggunaan cookies di situs PLEATSSSI untuk meningkatkan kenyamanan berbelanja Anda.')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

`;

// Add Seed Products (limit to 30 top products to avoid max query size while giving full dynamic catalog)
const catMap = {
  skirts: 'c1000000-0000-0000-0000-000000000001',
  tops: 'c2000000-0000-0000-0000-000000000002',
  pants: 'c3000000-0000-0000-0000-000000000003',
  others: 'c4000000-0000-0000-0000-000000000004',
};

sql += `-- 14. Seed Product Catalog Items\n`;

pleatsssiProducts.slice(0, 50).forEach((p, idx) => {
  const prodUuid = `p${String(idx + 1).padStart(7, '0')}-0000-0000-0000-000000000000`;
  const catId = catMap[p.category] || catMap.others;
  const nameEsc = p.name.replace(/'/g, "''");
  const slugEsc = p.id.toLowerCase().replace(/'/g, "''");
  const priceVal = p.priceValue || 865000;
  const colsJson = JSON.stringify(p.collections || ['new-arrivals']);

  sql += `
INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('${prodUuid}', '${catId}', '${nameEsc}', '${slugEsc}', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', ${priceVal}, 0, 'published', '${colsJson}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('${prodUuid}', '${p.color || 'Signature'}', '#0B4F3A', 'ALL SIZE', 'SKU-${p.id}', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('${prodUuid}', '${p.image}', 0, true)
ON CONFLICT DO NOTHING;
`;

  if (p.hoverImage && p.hoverImage !== p.image) {
    sql += `
INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('${prodUuid}', '${p.hoverImage}', 1, false)
ON CONFLICT DO NOTHING;
`;
  }
});

fs.writeFileSync(path.join(__dirname, '../supabase/full_schema_and_seed.sql'), sql, 'utf8');
console.log('Generated supabase/full_schema_and_seed.sql successfully!');
