import * as path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/coverage/**',
            'src/**/*.dom.test.{ts,tsx}',
            'src/**/*.component.test.{ts,tsx}',
          ],
          setupFiles: ['./vitest.setup.node.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.dom.test.{ts,tsx}', 'src/**/*.component.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
          setupFiles: ['./vitest.setup.dom.ts'],
          globals: true,
        },
      },
    ],
  },
})
