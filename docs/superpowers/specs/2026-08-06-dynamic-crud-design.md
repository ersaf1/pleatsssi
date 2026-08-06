# Spesifikasi Desain: Website Dinamis & Admin CRUD Panel (Supabase & Next.js)

Dokumen ini mendefinisikan arsitektur, skema database, struktur folder, alur otentikasi, dan skrip migrasi untuk membuat seluruh data website Pleatsssi bersifat dinamis dengan panel admin terintegrasi.

---

## 1. Tujuan & Kebutuhan Utama
1. **Dinamisasi Penuh**: Storefront membaca data produk, varian, kategori, banner hero, kupon diskon, dan halaman info statis (FAQ, Kebijakan Pengiriman, dll.) dari Supabase Database.
2. **Penyimpanan Gambar Dinamis**: Semua foto produk, kategori, dan banner diunggah langsung ke Supabase Storage (bucket `pleatsssi-assets`) dan bukan berupa tautan eksternal atau hardcode lokal.
3. **Admin CRUD Panel (`/id/admin`)**: Panel admin khusus yang dilindungi autentikasi role-based (`admin`/`owner`) untuk mengelola seluruh data website.
4. **Fallback Mechanism**: Jika koneksi Supabase gagal atau belum terkonfigurasi, aplikasi secara otomatis membaca data cadangan dari file JSON/TS statis agar website tidak crash saat pertama kali dinyalakan.

---

## 2. Struktur Database & Storage

### 2.1 Supabase Storage Bucket
Bucket Baru: `pleatsssi-assets`
* Status: Public Read (akses publik untuk membaca file gambar).
* Kebijakan RLS Storage: Hanya user dengan role `admin` atau `owner` yang bisa menulis/mengunggah (Write/Update/Delete).

### 2.2 Skema Tabel Baru & Perubahan (SQL Migrasi)

Kita akan membuat file migrasi baru `supabase/migrations/20260806000000_dynamic_tables.sql` untuk membuat tabel berikut:

#### `info_pages`
```sql
CREATE TABLE info_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### `banners`
```sql
CREATE TABLE banners (
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
```

#### `coupons`
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('fixed', 'percentage')),
  value DECIMAL(12,2) NOT NULL,
  min_purchase DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  max_discount DECIMAL(12,2),
  quota INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 3. Data Access Layer & Fallback (`src/lib/services/`)

Untuk mencegah kegagalan aplikasi saat database belum dikonfigurasi, layanan pengambilan data akan menggunakan pola fallback:

```typescript
// Contoh implementasi di src/lib/services/productService.ts
import { supabaseBrowserClient } from '../supabaseClient';
import { PRODUCTS as STATIC_PRODUCTS } from '@/data/products';

export async function getDynamicProducts() {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .eq('status', 'published');
      
    if (error || !data || data.length === 0) {
      return STATIC_PRODUCTS; // Fallback jika DB kosong atau error
    }
    
    // Map database structure to Product frontend interface
    return mapDbProductsToFrontend(data);
  } catch (err) {
    return STATIC_PRODUCTS; // Fallback
  }
}
```

Layanan yang akan dibuat:
1. `src/lib/services/productService.ts`
2. `src/lib/services/categoryService.ts`
3. `src/lib/services/bannerService.ts`
4. `src/lib/services/infoPageService.ts`

---

## 4. Struktur Antarmuka Admin (`/id/admin`)

Halaman admin diletakkan di bawah rute `/id/admin` dan memiliki struktur halaman sebagai berikut:

* **`/id/admin/login`**: Halaman masuk khusus admin.
* **`/id/admin/dashboard`**: Halaman statistik ringkas (Total produk, Kategori, Total order, Pendapatan).
* **`/id/admin/products`**: CRUD produk, manajemen varian (warna, swatch hex, ukuran, SKU, stok), serta unggah foto galeri produk.
* **`/id/admin/categories`**: CRUD kategori utama dan sub-kategori serta unggah ikon kategori.
* **`/id/admin/banners`**: CRUD Banner promosi dan hero untuk beranda serta unggah gambar versi desktop/mobile.
* **`/id/admin/coupons`**: CRUD kode voucher diskon beserta aturan minimum belanja dan kuota.
* **`/id/admin/info-pages`**: CRUD isi halaman statis (FAQ, Panduan Ukuran, Perawatan Produk, dll.) menggunakan text editor Markdown/HTML.
* **`/id/admin/orders`**: Melihat daftar transaksi penjualan, rincian pesanan, bukti pembayaran, dan mengubah status pengiriman serta memasukkan nomor resi kurir.

### 4.1 Desain UI Admin
Menggunakan sistem desain Pleatsssi dengan dominasi warna hijau tua khas (`#0B4F3A`), krem halus (`#FAF7F2`), serta elemen tipografi modern menggunakan shadcn/ui.

---

## 5. Skrip Seeding & Upload File (`scripts/seed-supabase.ts`)

Skrip ini akan dijalankan secara manual untuk melakukan inisialisasi database Supabase menggunakan data lokal:
1. **Insert Categories**: Membaca data kategori lokal dan memasukkannya ke tabel `categories`.
2. **Upload Images & Insert Products**: 
   * Mencari semua file foto produk lokal di `/public/images/products/*`.
   * Mengunggah file tersebut ke folder `products/` di bucket `pleatsssi-assets` via Supabase SDK.
   * Mendapatkan public URL hasil upload.
   * Menulis data produk, varian, dan link gambar baru tersebut ke tabel `products`, `product_variants`, dan `product_images`.
3. **Seed Info Pages**: Mengisi tabel `info_pages` dengan data halaman informasi awal dari `src/data/info-pages.ts`.

---

## 6. Otentikasi & Otorisasi Rute Admin

Akses rute `/id/admin` akan diproteksi menggunakan **Next.js Middleware**:
1. Middleware memeriksa cookie sesi Supabase (`sb-access-token` / `sb-refresh-token`).
2. Jika tidak ada sesi, pengguna diarahkan ke `/id/admin/login`.
3. Jika sesi aktif, middleware mengecek data pengguna dari tabel `users` untuk memvalidasi kolom `role`.
4. Jika `role` bernilai `customer`, pengguna ditolak aksesnya dan dikembalikan ke halaman beranda dengan pesan peringatan. Akses hanya diberikan untuk `admin` dan `owner`.
