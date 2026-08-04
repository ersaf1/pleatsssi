import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
});
