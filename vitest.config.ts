import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'hono/jsx',
    },
    test: {
        environment: 'node',
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.test.{ts,tsx}'],
    },
});
