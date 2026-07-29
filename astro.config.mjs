import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://measureover.com',
  integrations: [preact(), sitemap()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    // Tailwind v4 ships as a Vite plugin; @astrojs/tailwind is deprecated.
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
