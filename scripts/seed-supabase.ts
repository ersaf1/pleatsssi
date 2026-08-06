import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CATEGORY_META } from '../src/data/categories';
import { INFO_PAGES } from '../src/data/info-pages';
import pleatsssiProducts from '../src/data/pleatsssi-products.json';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SeedProductInput {
  id: string;
  name: string;
  color?: string;
  priceValue: number;
  discount?: string | null;
  image: string;
  hoverImage: string;
  swatches?: string[];
  gallery?: string[];
  category: string;
}

async function ensureBucket(bucketName: string) {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn("Could not list buckets:", error.message);
      return;
    }
    const exists = buckets.some((b: { name: string }) => b.name === bucketName);
    if (!exists) {
      console.log(`Creating bucket '${bucketName}'...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      if (createError) console.warn(`Failed to create bucket ${bucketName}:`, createError.message);
      else console.log(`Bucket '${bucketName}' created successfully.`);
    } else {
      console.log(`Bucket '${bucketName}' already exists.`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Bucket check error:", message);
  }
}

async function uploadImage(imagePath: string, bucketName = 'pleatsssi-assets'): Promise<string> {
  if (!imagePath) return '';
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const localFilePath = path.join(process.cwd(), 'public', cleanPath.replace(/^public\//, ''));

  if (!fs.existsSync(localFilePath)) {
    console.warn(`Local image file not found: ${localFilePath}`);
    return imagePath;
  }

  try {
    const fileBuffer = fs.readFileSync(localFilePath);
    
    // Preserve full relative directory structure (e.g. images/products/AGATE/AGATE SKIRT.jpg -> products/AGATE/AGATE SKIRT.jpg)
    let storagePath = cleanPath.replace(/^(public\/)?(images\/)?/, '');
    if (!storagePath.startsWith('products/') && !storagePath.startsWith('banners/')) {
      storagePath = cleanPath.includes('products') ? `products/${storagePath}` : `banners/${storagePath}`;
    }

    const ext = path.extname(localFilePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Failed to upload ${cleanPath}:`, uploadError.message);
      return imagePath;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    return data.publicUrl;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`Error processing image ${cleanPath}:`, message);
    return imagePath;
  }
}

export async function seed() {
  console.log("Seeding process started...");

  // 0. Ensure Storage Bucket
  await ensureBucket('pleatsssi-assets');

  // 1. Seed Categories
  console.log("\n--- Seeding Categories ---");
  const categories = [
    { name: "Rok", slug: "skirts", description: CATEGORY_META.skirts?.description || "Koleksi rok PLEATSSSI" },
    { name: "Atasan", slug: "tops", description: CATEGORY_META.tops?.description || "Atasan PLEATSSSI" },
    { name: "Celana", slug: "pants", description: CATEGORY_META.pants?.description || "Celana PLEATSSSI" },
    { name: "Lainnya", slug: "others", description: CATEGORY_META.others?.description || "Koleksi item pilihan PLEATSSSI" }
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const { data, error } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' }).select();
    if (error) {
      console.error(`Category seed error [${cat.slug}]:`, error.message);
      const indexStr = String(categoryMap.size + 1).padStart(12, '0');
      categoryMap.set(cat.slug, `00000000-0000-0000-0000-${indexStr}`);
    } else if (data && data[0]) {
      categoryMap.set(cat.slug, data[0].id);
      console.log(`Category seeded: ${cat.slug} (ID: ${data[0].id})`);
    } else {
      const indexStr = String(categoryMap.size + 1).padStart(12, '0');
      categoryMap.set(cat.slug, `00000000-0000-0000-0000-${indexStr}`);
    }
  }

  console.log("Categories processed.");

  // 2. Seed Products, Variants, & Images
  const rawProductsList = pleatsssiProducts as unknown as SeedProductInput[];
  console.log(`\n--- Seeding Products (${rawProductsList.length} items) ---`);
  for (const p of rawProductsList) {
    const categoryId = categoryMap.get(p.category) || categoryMap.get('others');
    if (!categoryId) {
      console.error(`No category found for product ${p.id}`);
      continue;
    }

    const slug = (p.id || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const productRecord = {
      category_id: categoryId,
      name: p.name,
      slug: slug,
      description: `Koleksi eksklusif ${p.name} dari PLEATSSSI dengan bahan lipit premium yang nyaman dan stylish.`,
      material: 'Premium Pleats Polyester',
      price: p.priceValue,
      discount: p.discount ? parseInt(p.discount.replace(/\D/g, ''), 10) || 0 : 0,
      status: 'published',
    };

    const { data: insertedProducts, error: prodError } = await supabase
      .from('products')
      .upsert(productRecord, { onConflict: 'slug' })
      .select();

    if (prodError || !insertedProducts || insertedProducts.length === 0) {
      console.error(`Product seed error [${p.name}]:`, prodError?.message);
      continue;
    }

    const productId = insertedProducts[0].id;

    // Variant
    const variantRecord = {
      product_id: productId,
      color: p.color || 'Default',
      color_hex: p.swatches?.[0] || '#000000',
      size: 'All Size',
      sku: `${slug.toUpperCase()}-ALL`,
      stock: 50,
    };

    const { data: insertedVariants, error: varError } = await supabase
      .from('product_variants')
      .upsert(variantRecord, { onConflict: 'sku' })
      .select();

    if (varError) {
      console.warn(`Variant seed warning [${p.name}]:`, varError.message);
    }

    // Clear existing images for idempotency before re-inserting
    const { error: clearImagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);

    if (clearImagesError) {
      console.warn(`Clear existing images warning [${p.name}]:`, clearImagesError.message);
    }

    // Images
    const rawImages = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image, p.hoverImage].filter(Boolean);
    const uniqueImages = Array.from(new Set(rawImages)) as string[];

    for (let i = 0; i < uniqueImages.length; i++) {
      const imgPath = uniqueImages[i];
      const uploadedUrl = await uploadImage(imgPath);

      const imageRecord = {
        product_id: productId,
        variant_id: insertedVariants?.[0]?.id || null,
        image_url: uploadedUrl,
        sort_order: i,
        is_primary: i === 0,
      };

      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imageRecord);

      if (imgError) {
        console.warn(`Image seed warning [${p.name} #${i}]:`, imgError.message);
      }
    }

    console.log(`Product processed: ${p.name}`);
  }

  // 3. Seed Info Pages
  console.log("\n--- Seeding Info Pages ---");
  for (const [slug, info] of Object.entries(INFO_PAGES)) {
    const infoData = {
      slug,
      title: info.title,
      content: JSON.stringify({
        intro: info.intro,
        sections: info.sections,
      }),
    };

    const { error: infoError } = await supabase
      .from('info_pages')
      .upsert(infoData, { onConflict: 'slug' });

    if (infoError) {
      console.error(`Info page seed error [${slug}]:`, infoError.message);
    } else {
      console.log(`Info page seeded: ${slug}`);
    }
  }

  // 4. Seed Banners
  console.log("\n--- Seeding Banners ---");
  // Clear existing banners for idempotency before re-inserting
  const { error: clearBannersError } = await supabase
    .from('banners')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (clearBannersError) {
    console.warn("Clear existing banners warning:", clearBannersError.message);
  }

  const banners = [
    {
      type: "hero",
      title: "Koleksi Terbaru PLEATSSSI",
      subtitle: "Temukan keanggunan lipit modern untuk gaya sehari-hari",
      image_url_desktop: "/images/hero-desktop.png",
      image_url_mobile: "/images/hero-mobile.png",
      cta_label: "Belanja Sekarang",
      cta_url: "/id/new-arrivals",
      sort_order: 1,
      is_active: true,
    },
    {
      type: "lifestyle",
      title: "Gaya Sepatu Lipit",
      subtitle: "Paduan sempurna atasan dan bawahan lipit",
      image_url_desktop: "/images/lifestyle-shoes.png",
      image_url_mobile: "/images/lifestyle-shoes.png",
      cta_label: "Jelajahi Koleksi",
      cta_url: "/id/skirts",
      sort_order: 1,
      is_active: true,
    },
    {
      type: "lifestyle",
      title: "Koleksi Musim Baru",
      subtitle: "Warna dan desain segar untuk penampilan Anda",
      image_url_desktop: "/images/lifestyle-new.png",
      image_url_mobile: "/images/lifestyle-new.png",
      cta_label: "Lihat Produk",
      cta_url: "/id/tops",
      sort_order: 2,
      is_active: true,
    }
  ];

  for (const b of banners) {
    const desktopUrl = await uploadImage(b.image_url_desktop);
    const mobileUrl = await uploadImage(b.image_url_mobile);

    const { error: bannerError } = await supabase
      .from('banners')
      .insert({
        ...b,
        image_url_desktop: desktopUrl,
        image_url_mobile: mobileUrl,
      });

    if (bannerError) {
      console.warn(`Banner seed warning [${b.title}]:`, bannerError.message);
    } else {
      console.log(`Banner seeded: ${b.title}`);
    }
  }

  console.log("\nSeeding process completed!");
}

seed().catch((err: unknown) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
