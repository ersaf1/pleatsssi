import { expect, test } from 'vitest';

test('verify env parameters exist', () => {
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
});
