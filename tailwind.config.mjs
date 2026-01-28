/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'broken-white': '#f5f5f0',
        'burnt-orange': {
          DEFAULT: '#cc5500',
          hover: '#b84a00',
        },
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2a2a2a',
      },
    },
  },
  plugins: [],
};
