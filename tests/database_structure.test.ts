import { expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';

test('migration file exists', () => {
  const filePath = path.join(__dirname, '../supabase/migrations/20260806000000_dynamic_tables.sql');
  expect(fs.existsSync(filePath)).toBe(true);
});

test('migration file contains dynamic tables definition', () => {
  const filePath = path.join(__dirname, '../supabase/migrations/20260806000000_dynamic_tables.sql');
  const sqlContent = fs.readFileSync(filePath, 'utf-8');
  
  expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS info_pages');
  expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS banners');
  expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS coupons');
});
