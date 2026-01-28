# Quick Start Guide

## For Developers

### Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the app.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

- `src/components/` - Preact components (interactive UI)
- `src/layouts/` - Astro layouts (page structure)
- `src/pages/` - Astro pages (routes)
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `public/` - Static assets

## For Users

1. **Upload Image**: Drag and drop an image or click "Choose File"
2. **Select Paper Size**: Choose A5 (default), A6, A4, or US Letter
3. **Draw Lines**: Click and drag on the image to draw measurement lines
4. **View Coordinates**: See intersection coordinates in millimeters in the sidebar
5. **Adjust Image**: Use sliders to adjust brightness, contrast, or convert to grayscale
6. **Change Theme**: Toggle between light/dark mode using the theme button

## Keyboard Shortcuts

- `Escape` - Clear all lines or cancel current drawing

## Features

- ✅ Image upload (drag-drop or file picker)
- ✅ Draw measurement lines
- ✅ Coordinate calculation in millimeters
- ✅ Multiple paper sizes
- ✅ Image adjustments (grayscale, brightness, contrast)
- ✅ Light/dark theme
- ✅ Keyboard navigation
- ✅ Mobile/touch support
- ✅ Accessibility features
