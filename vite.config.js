import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    open: true,
  },
});
