import { expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';

test('seed script exists', () => {
  const filePath = path.join(__dirname, '../scripts/seed-supabase.ts');
  expect(fs.existsSync(filePath)).toBe(true);
});

test('package.json contains db:seed script definition', () => {
  const pkgPath = path.join(__dirname, '../package.json');
  const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  expect(pkgContent.scripts['db:seed']).toBe('node --import tsx scripts/seed-supabase.ts');
});

test('seed script file contains seed function and storage/category seeding logic', () => {
  const filePath = path.join(__dirname, '../scripts/seed-supabase.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  expect(content).toContain('export async function seed()');
  expect(content).toContain('pleatsssi-assets');
  expect(content).toContain('categories');
  expect(content).toContain('products');
  expect(content).toContain('product_variants');
  expect(content).toContain('product_images');
  expect(content).toContain('info_pages');
  expect(content).toContain('banners');
});
