# MeasureOver

A fast, lightweight, client-only web application for adding measurement lines on top of images to guide drawing. Built with Astro and Preact.

## Features

- 📸 Upload images via drag-and-drop or file picker
- ✏️ Draw measurement lines on images
- 📏 View coordinates of line intersections in millimeters
- 📄 Support for multiple paper sizes (A5, A6, A4, US Letter)
- 🎨 Image adjustments (grayscale, brightness, contrast)
- 🌓 Light and dark theme support
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

- **Astro** - Static site generator
- **Preact** - Lightweight React alternative
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

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

This app is designed to be deployed to Cloudflare Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. Build the project: `npm run build`
2. Deploy the `dist/` directory to Cloudflare Pages
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 20

For GitHub integration, CI/CD, and mobile testing instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## License

MIT License - see LICENSE file for details

## Contributing

See `docs/` directory for detailed specifications and LLM tool guides.
