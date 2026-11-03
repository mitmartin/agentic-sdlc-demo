import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/server/**/*.ts'],
      exclude: ['src/server/index.ts'],
      reporter: ['text', 'json-summary', 'lcov'],
      thresholds: { lines: 70 },
    },
  },
});
