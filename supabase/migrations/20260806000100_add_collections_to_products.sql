-- Add collections column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS collections TEXT[] DEFAULT '{}';
