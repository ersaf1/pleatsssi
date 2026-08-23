const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkiaakfodasgkqpgfhno.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!serviceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const pleatsssiProducts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/pleatsssi-products.json'), 'utf8')
);

async function seed() {
  console.log('--- Starting Live Supabase Seeding ---');

  // 1. Seed Categories
  const categories = [
    { id: 'c1000000-0000-0000-0000-000000000001', name: 'Skirts', slug: 'skirts', description: 'Signature Pleated Skirts Collection' },
    { id: 'c2000000-0000-0000-0000-000000000002', name: 'Tops', slug: 'tops', description: 'Signature Pleated Tops Collection' },
    { id: 'c3000000-0000-0000-0000-000000000003', name: 'Pants', slug: 'pants', description: 'Signature Pleated Pants Collection' },
    { id: 'c4000000-0000-0000-0000-000000000004', name: 'Others', slug: 'others', description: 'Accessories & Special Pieces Collection' },
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catErr) console.log('Category seed result:', catErr.message);
  else console.log('✓ Categories seeded successfully.');

  // 2. Seed Banners
  const banners = [
    { type: 'hero', title: 'Koleksi Terbaru PLEATSSSI', subtitle: 'Desain Pleats Mewah Bertekstur Haute-Couture', image_url_desktop: '/images/products/AGATE/AGATE TOP.jpg', image_url_mobile: '/images/products/AGATE/AGATE TOP.jpg', cta_label: 'Jelajahi Koleksi', cta_url: '/id/new-arrivals', sort_order: 1, is_active: true },
    { type: 'lifestyle', title: 'Pleated Skirts', subtitle: 'Kemewahan Dalam Setiap Gerakan', image_url_desktop: '/images/products/RAIA ONE/RAIA SKIRT.jpg', image_url_mobile: '/images/products/RAIA ONE/RAIA SKIRT.jpg', cta_label: 'Belanja Skirts', cta_url: '/id/skirts', sort_order: 1, is_active: true },
    { type: 'lifestyle', title: 'Pleated Tops', subtitle: 'Refined Silhouette & Timeless Elegance', image_url_desktop: '/images/products/AURORA ONE/AURORA TOP.jpg', image_url_mobile: '/images/products/AURORA ONE/AURORA TOP.jpg', cta_label: 'Belanja Tops', cta_url: '/id/tops', sort_order: 2, is_active: true },
  ];

  const { error: banErr } = await supabase.from('banners').insert(banners);
  if (banErr) console.log('Banners seed result:', banErr.message);
  else console.log('✓ Banners seeded successfully.');

  // 3. Seed Info Pages
  const infoPages = [
    { slug: 'faq', title: 'Pertanyaan Umum (FAQ)', content: 'Selamat datang di halaman FAQ PLEATSSSI. Temukan jawaban seputar pemesanan, pengiriman, dan panduan perawatan pleated fashion kami.' },
    { slug: 'pengiriman-pelacakan', title: 'Pengiriman & Pelacakan', content: 'Layanan pengiriman PLEATSSSI mencakup seluruh wilayah Indonesia dengan estimasi pengiriman 2-5 hari kerja.' },
    { slug: 'pengembalian', title: 'Kebijakan Pengembalian', content: 'Pengembalian produk dapat dilakukan dalam waktu 7 hari setelah barang diterima.' },
    { slug: 'perawatan-produk', title: 'Panduan Perawatan Produk Pleats', content: 'Untuk menjaga tekstur lipatan (pleats) tetap tajam dan indah: Cuci dengan tangan menggunakan air dingin, jangan gunakan mesin pengering, dan gantung dengan rapi.' },
    { slug: 'lokasi-toko', title: 'Lokasi Toko', content: 'Kunjungi flagship store dan popup gallery PLEATSSSI di Jakarta, Bali, dan Surabaya.' },
    { slug: 'panduan-ukuran', title: 'Panduan Ukuran (Size Guide)', content: 'Produk PLEATSSSI dirancang dengan material pleated berkualitas tinggi yang fleksibel (All Size / Stretch).' },
    { slug: 'privacy-policy', title: 'Kebijakan Privasi', content: 'PLEATSSSI berkomitmen melindungi privasi data pribadi Anda.' },
    { slug: 'terms-of-use', title: 'Syarat & Ketentuan', content: 'Syarat dan ketentuan penggunaan situs web resmi PLEATSSSI Indonesia.' },
    { slug: 'cookies-policy', title: 'Kebijakan Cookies', content: 'Penggunaan cookies di situs PLEATSSSI untuk meningkatkan kenyamanan berbelanja Anda.' }
  ];

  const { error: infoErr } = await supabase.from('info_pages').upsert(infoPages, { onConflict: 'slug' });
  if (infoErr) console.log('Info pages seed result:', infoErr.message);
  else console.log('✓ Info pages seeded successfully.');
}

seed();
