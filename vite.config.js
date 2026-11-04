
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/PierpaoloIannicelliPortfolio/',

  server: {
    allowedHosts: ['terminal.local'],
  },

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
