# MeasureOver

A fast, lightweight, client-only web application for adding measurement lines on top of images to guide drawing. Built with Astro and Preact.

## Features

- 📸 Upload images via drag-and-drop or file picker
- ✏️ Draw measurement lines on images (with horizontal/vertical snapping)
- 🎯 Move and delete individual lines
- ↩️ Undo/redo functionality with keyboard shortcuts
- 📏 View coordinates of line intersections in multiple units (mm, cm, inches)
- 📄 Support for multiple paper sizes (A6-A0, US Letter/Legal/Tabloid)
- 🎨 Image adjustments (grayscale, brightness, contrast, rotation, crop)
- 📐 Grid overlay with adjustable opacity
- 💾 Save and load projects (localStorage)
- 📥 Export images with lines overlay at paper size resolution (300 DPI)
- 🌓 Light and dark theme support with high contrast mode
- 🌍 Multi-language support (English, Finnish, Swedish)
- 📱 Mobile-optimized with touch gestures and thicker lines
- ♿ Accessibility features (keyboard navigation, color-blind friendly)
- ⚡ Optimized for speed and performance

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd measureovercom
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to Cloudflare Pages or any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
measureovercom/
├── src/
│   ├── components/       # Preact components
│   ├── layouts/          # Astro layouts
│   ├── pages/            # Astro pages
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
├── docs/                 # Documentation and specifications
└── dist/                 # Build output (generated)
```

## Technology Stack

- **Astro 7** - Static site generator
- **Preact 10** - Lightweight React alternative
- **TypeScript 6** - Type safety (strict mode)
- **Tailwind CSS 4** - Utility-first CSS, configured CSS-first in
  `src/styles/global.css` via `@theme` (there is no `tailwind.config.*`)

Requires **Node 22.12+** (`.nvmrc` pins 24).

Tailwind is loaded through `@tailwindcss/vite`, not the deprecated
`@astrojs/tailwind` integration.

## Development

### Code Style

- Follow Preact best practices
- Use conventional commits
- TypeScript strict mode enabled
- Prettier for code formatting

### Committing

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat: add coordinate export feature`
- `fix: correct canvas drawing on touch devices`
- `docs: update README with deployment instructions`
- `style: improve button hover states`
- `refactor: extract paper size logic to utility`

## Deployment

Push to `main` — Cloudflare Pages builds and deploys automatically.
GitHub Actions runs typecheck + build as a quality gate alongside it. See
[DEPLOYMENT.md](./DEPLOYMENT.md) for the full picture.

## Analytics

Aggregate page views via [Glyphex](https://glyphex.io) — production
builds only, no cookies, no personal data, no consent banner. It is the
only third-party script on the site.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## License

MIT License - see LICENSE file for details

## Contributing

See `docs/` directory for detailed specifications and LLM tool guides.
