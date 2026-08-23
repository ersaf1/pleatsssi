-- ============================================================
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

-- 14. Seed Product Catalog Items

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000001-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'AGATE SKIRT', 'agate-agate-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 960000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000001-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AGATE-AGATE-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000001-0000-0000-0000-000000000000', '/images/products/AGATE/AGATE SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000001-0000-0000-0000-000000000000', '/images/products/AGATE/AGATE TOP.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000002-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'AGATE TOP', 'agate-agate-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 865000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000002-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AGATE-AGATE-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000002-0000-0000-0000-000000000000', '/images/products/AGATE/AGATE TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000002-0000-0000-0000-000000000000', '/images/products/AGATE/AGATE SKIRT.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000003-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'ALPHA SHORT PANTS', 'aplha-alpha-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 980000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000003-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-APLHA-ALPHA-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000003-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000003-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000004-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'ALPHA SKIRT', 'aplha-alpha-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 810000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000004-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-APLHA-ALPHA-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000004-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000004-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000005-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'ALPHA TOP', 'aplha-alpha-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 820000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000005-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-APLHA-ALPHA-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000005-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000005-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000006-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'APLHA PANTS', 'aplha-aplha-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 850000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000006-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-APLHA-APLHA-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000006-0000-0000-0000-000000000000', '/images/products/APLHA/APLHA PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000006-0000-0000-0000-000000000000', '/images/products/APLHA/ALPHA SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000007-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'ARROW PANTS', 'arrow-arrow-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 970000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000007-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-ARROW-ARROW-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000007-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000007-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000008-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'ARROW SHORT PANTS', 'arrow-arrow-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 910000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000008-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-ARROW-ARROW-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000008-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000008-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000009-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'ARROW SKIRT', 'arrow-arrow-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 975000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000009-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-ARROW-ARROW-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000009-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000009-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000010-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'ARROW TOP', 'arrow-arrow-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 940000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000010-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-ARROW-ARROW-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000010-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000010-0000-0000-0000-000000000000', '/images/products/ARROW/ARROW PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000011-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'AURORA SKIRT', 'aurora-one-aurora-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 985000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000011-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-ONE-AURORA-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000011-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000011-0000-0000-0000-000000000000', '/images/products/AURORA TOO/AURORA TOO SHORT TOP.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000012-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'AURORA TOO SHORT TOP', 'aurora-too-aurora-too-short-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 860000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000012-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-TOO-AURORA-TOO-SHORT-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000012-0000-0000-0000-000000000000', '/images/products/AURORA TOO/AURORA TOO SHORT TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000012-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000013-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'AURORA TOO SKIRT', 'aurora-too-aurora-too-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 895000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000013-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-TOO-AURORA-TOO-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000013-0000-0000-0000-000000000000', '/images/products/AURORA TOO/AURORA TOO SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000013-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000014-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'AURORA TOO TOP', 'aurora-too-aurora-too-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 855000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000014-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-TOO-AURORA-TOO-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000014-0000-0000-0000-000000000000', '/images/products/AURORA TOO/AURORA TOO TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000014-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000015-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'AURORA TOO TOP 65 CM', 'aurora-one-aurora-too-top-65-cm', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 820000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000015-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-ONE-AURORA-TOO-TOP-65-CM', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000015-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA TOO TOP 65 CM.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000015-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000016-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'AURORA TOP', 'aurora-one-aurora-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 960000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000016-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-AURORA-ONE-AURORA-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000016-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000016-0000-0000-0000-000000000000', '/images/products/AURORA ONE/AURORA SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000017-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'BACKY SKIRT', 'backy-backy-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 890000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000017-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BACKY-BACKY-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000017-0000-0000-0000-000000000000', '/images/products/BACKY/BACKY SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000017-0000-0000-0000-000000000000', '/images/products/BAGGY/BAGGY PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000018-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'BAGGY PANTS', 'baggy-baggy-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 815000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000018-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BAGGY-BAGGY-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000018-0000-0000-0000-000000000000', '/images/products/BAGGY/BAGGY PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000018-0000-0000-0000-000000000000', '/images/products/BACKY/BACKY SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000019-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'BAGGY SHORT PANTS', 'baggy-baggy-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 940000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000019-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BAGGY-BAGGY-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000019-0000-0000-0000-000000000000', '/images/products/BAGGY/BAGGY SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000019-0000-0000-0000-000000000000', '/images/products/BACKY/BACKY SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000020-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'BAGGY SKIRT', 'baggy-baggy-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 940000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000020-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BAGGY-BAGGY-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000020-0000-0000-0000-000000000000', '/images/products/BAGGY/BAGGY SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000020-0000-0000-0000-000000000000', '/images/products/BACKY/BACKY SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000021-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'BAMBI SKIRT', 'bambi-bambi-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 955000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000021-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BAMBI-BAMBI-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000021-0000-0000-0000-000000000000', '/images/products/BAMBI/BAMBI SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000021-0000-0000-0000-000000000000', '/images/products/BAMBI/BAMBI TOP.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000022-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'BAMBI TOP', 'bambi-bambi-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 955000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000022-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BAMBI-BAMBI-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000022-0000-0000-0000-000000000000', '/images/products/BAMBI/BAMBI TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000022-0000-0000-0000-000000000000', '/images/products/BAMBI/BAMBI SKIRT.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000023-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'BECKY PANTS', 'becky-becky-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 800000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000023-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BECKY-BECKY-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000023-0000-0000-0000-000000000000', '/images/products/BECKY/BECKY PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000023-0000-0000-0000-000000000000', '/images/products/BECKY/BECKY SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000024-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'BECKY SHORT PANTS', 'becky-becky-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 970000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000024-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BECKY-BECKY-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000024-0000-0000-0000-000000000000', '/images/products/BECKY/BECKY SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000024-0000-0000-0000-000000000000', '/images/products/BECKY/BECKY PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000025-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'BLOOM SKIRT', 'bloom-bloom-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 815000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000025-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BLOOM-BLOOM-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000025-0000-0000-0000-000000000000', '/images/products/BLOOM/BLOOM SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000025-0000-0000-0000-000000000000', '/images/products/BLOOM/BLOOM TOP.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000026-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'BLOOM TOP', 'bloom-bloom-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 980000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000026-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BLOOM-BLOOM-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000026-0000-0000-0000-000000000000', '/images/products/BLOOM/BLOOM TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000026-0000-0000-0000-000000000000', '/images/products/BLOOM/BLOOM SKIRT.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000027-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'BOLDEN LONG TOP TUNIK', 'bolden-bolden-long-top-tunik', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 800000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000027-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BOLDEN-BOLDEN-LONG-TOP-TUNIK', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000027-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN LONG TOP  TUNIK.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000027-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000028-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'BOLDEN SHORT PANTS', 'bolden-bolden-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 840000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000028-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BOLDEN-BOLDEN-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000028-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000028-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN LONG TOP  TUNIK.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000029-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'BOLDEN SKIRT', 'bolden-bolden-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 825000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000029-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BOLDEN-BOLDEN-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000029-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000029-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN LONG TOP  TUNIK.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000030-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'BOLDEN TOP', 'bolden-bolden-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 800000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000030-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-BOLDEN-BOLDEN-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000030-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000030-0000-0000-0000-000000000000', '/images/products/BOLDEN/BOLDEN LONG TOP  TUNIK.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000031-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CALYA PANTS', 'calya-calya-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 905000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000031-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CALYA-CALYA-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000031-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA PANTS .jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000031-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000032-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CALYA SHORT PANTS', 'calya-calya-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 820000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000032-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CALYA-CALYA-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000032-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000032-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA PANTS .jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000033-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CALYA SKIRT', 'calya-calya-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 920000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000033-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CALYA-CALYA-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000033-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000033-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA PANTS .jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000034-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CALYA TOP', 'calya-calya-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 915000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000034-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CALYA-CALYA-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000034-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000034-0000-0000-0000-000000000000', '/images/products/CALYA/CALYA PANTS .jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000035-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CANAL SHORT PANTS', 'canal-canal-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 800000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000035-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANAL-CANAL-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000035-0000-0000-0000-000000000000', '/images/products/CANAL/CANAL SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000035-0000-0000-0000-000000000000', '/images/products/CANAL/CANAL SKIRT.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000036-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CANAL SKIRT', 'canal-canal-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 885000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000036-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANAL-CANAL-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000036-0000-0000-0000-000000000000', '/images/products/CANAL/CANAL SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000036-0000-0000-0000-000000000000', '/images/products/CANAL/CANAL SHORT PANTS.jpg', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000037-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CANIS PANTS', 'canis-canis-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 945000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000037-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANIS-CANIS-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000037-0000-0000-0000-000000000000', '/images/products/CANIS/CANIS PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000037-0000-0000-0000-000000000000', '/images/products/CANIS/IMG_4615.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000038-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CANIS SHORT PANTS', 'canis-canis-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 990000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000038-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANIS-CANIS-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000038-0000-0000-0000-000000000000', '/images/products/CANIS/CANIS SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000038-0000-0000-0000-000000000000', '/images/products/CANIS/IMG_4615.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000039-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CANIS SKIRT', 'canis-canis-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 955000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000039-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANIS-CANIS-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000039-0000-0000-0000-000000000000', '/images/products/CANIS/CANIS SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000039-0000-0000-0000-000000000000', '/images/products/CANIS/IMG_4615.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000040-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CANIS TOP', 'canis-canis-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 875000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000040-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANIS-CANIS-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000040-0000-0000-0000-000000000000', '/images/products/CANIS/CANIS TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000040-0000-0000-0000-000000000000', '/images/products/CANIS/IMG_4615.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000041-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CANVA LONG TOP TUNIK', 'canva-canva-long-top-tunik', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 840000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000041-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANVA-CANVA-LONG-TOP-TUNIK', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000041-0000-0000-0000-000000000000', '/images/products/CANVA/CANVA LONG TOP  TUNIK.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000041-0000-0000-0000-000000000000', '/images/products/CANVA/IMG_4614.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000042-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CANVA PANTS', 'canva-canva-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 840000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000042-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANVA-CANVA-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000042-0000-0000-0000-000000000000', '/images/products/CANVA/CANVA PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000042-0000-0000-0000-000000000000', '/images/products/CANVA/IMG_4614.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000043-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000003', 'CANVA SHORT PANTS', 'canva-canva-short-pants', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 930000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000043-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANVA-CANVA-SHORT-PANTS', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000043-0000-0000-0000-000000000000', '/images/products/CANVA/CANVA SHORT PANTS.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000043-0000-0000-0000-000000000000', '/images/products/CANVA/IMG_4614.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000044-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CANVA SKIRT', 'canva-canva-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 965000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000044-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANVA-CANVA-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000044-0000-0000-0000-000000000000', '/images/products/CANVA/CANVA SKIRT.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000044-0000-0000-0000-000000000000', '/images/products/CANVA/IMG_4614.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000045-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CANVA TOP', 'canva-canva-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 810000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000045-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CANVA-CANVA-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000045-0000-0000-0000-000000000000', '/images/products/CANVA/CANVA TOP.JPG', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000045-0000-0000-0000-000000000000', '/images/products/CANVA/IMG_4614.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000046-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CATHY SKIRT', 'cathy-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 810000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000046-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CATHY-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000046-0000-0000-0000-000000000000', '/images/products/CATHY SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000046-0000-0000-0000-000000000000', '/images/products/IMG_3835.JPG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000047-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CATTLEYA LONG TOP TUNIK', 'cattleya-cattleya-long-top-tunik', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 895000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000047-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CATTLEYA-CATTLEYA-LONG-TOP-TUNIK', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000047-0000-0000-0000-000000000000', '/images/products/CATTLEYA/CATTLEYA LONG TOP  TUNIK.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000047-0000-0000-0000-000000000000', '/images/products/CATTLEYA/IMG_4611.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000048-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CATTLEYA SHORT TOP', 'cattleya-cattleya-short-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 860000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000048-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CATTLEYA-CATTLEYA-SHORT-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000048-0000-0000-0000-000000000000', '/images/products/CATTLEYA/CATTLEYA SHORT TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000048-0000-0000-0000-000000000000', '/images/products/CATTLEYA/IMG_4611.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000049-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000001', 'CATTLEYA SKIRT', 'cattleya-cattleya-skirt', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 890000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000049-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CATTLEYA-CATTLEYA-SKIRT', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000049-0000-0000-0000-000000000000', '/images/products/CATTLEYA/CATTLEYA SKIRT.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000049-0000-0000-0000-000000000000', '/images/products/CATTLEYA/IMG_4611.PNG', 1, false)
ON CONFLICT DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, material, price, discount, status, collections)
VALUES ('p0000050-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000002', 'CATTLEYA TOP', 'cattleya-cattleya-top', 'Signature Pleatsssi piece featuring high-quality heat-set pleats with elegant drape.', '100% Polyester Heat-Set Pleats', 955000, 0, 'published', '["new-arrivals","trending-now","sale","gifts"]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_variants (product_id, color, color_hex, size, sku, stock)
VALUES ('p0000050-0000-0000-0000-000000000000', 'Signature', '#0B4F3A', 'ALL SIZE', 'SKU-CATTLEYA-CATTLEYA-TOP', 30)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000050-0000-0000-0000-000000000000', '/images/products/CATTLEYA/CATTLEYA TOP.jpg', 0, true)
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
VALUES ('p0000050-0000-0000-0000-000000000000', '/images/products/CATTLEYA/IMG_4611.PNG', 1, false)
ON CONFLICT DO NOTHING;
