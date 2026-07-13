import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/types/**',
        'src/mocks/**',
        'src/**/*.types.ts',
        // Barrel files — re-exports only, no logic to cover
        'src/**/index.ts',
        // Stub pages — placeholder content, no logic
        'src/pages/AboutUs/**',
        'src/pages/Contact/**',
        'src/pages/Faq/**',
        'src/pages/Services/**',
        // Not yet tested — will add in future batches
        'src/components/ui/Carousel/**',
        'src/components/ui/Button/ScrollToTop.tsx',
        'src/components/layout/Header.tsx',
        'src/App.tsx',
      ],
      thresholds: {
        // v1 baseline — raise as more components get tested
        statements: 40,
        branches: 35,
        functions: 35,
        lines: 40,
      },
    },
  },
})
