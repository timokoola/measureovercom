# LLM Development Guide for MeasureOver

This guide helps LLM tools understand the codebase structure, conventions, and best practices for contributing to MeasureOver.

## Architecture Overview

MeasureOver is a client-only web application built with:
- **Astro** for static site generation and routing
- **Preact** for interactive UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## Key Principles

1. **Performance First**: Optimize for Lighthouse scores, minimize bundle size
2. **Accessibility**: Support keyboard navigation, screen readers, color-blind users
3. **Client-Only**: No server-side rendering, works entirely in the browser
4. **Progressive Enhancement**: Graceful degradation for older browsers

## Component Structure

### Preact Components

All interactive components are in `src/components/`:
- Use Preact hooks (`useState`, `useEffect`, `useRef`)
- Prefer function components over class components
- Use `client:load` directive in Astro for hydration

### Component Patterns

```tsx
// Component with state
import { useState } from 'preact/hooks';

export function MyComponent() {
  const [state, setState] = useState(initialValue);
  // ...
}
```

### Type Definitions

All types are in `src/types/index.ts`. When adding new features:
1. Define types first
2. Use TypeScript strict mode
3. Export types for reuse

## Styling Guidelines

### Color Palette

- **Broken White**: `#f5f5f0` - Background color
- **Black**: `#000000` - Text in light mode
- **Burnt Orange**: `#cc5500` - Primary accent color
- **Dark Background**: `#1a1a1a` - Dark mode background
- **Dark Surface**: `#2a2a2a` - Dark mode surface

### Theme System

- Light/dark mode based on system preference or user choice
- High contrast mode for accessibility
- Theme stored in localStorage
- Use Tailwind dark mode classes: `dark:bg-dark-bg`

### Accessibility Colors

- Ensure sufficient contrast ratios (WCAG AA minimum)
- Don't rely solely on color to convey information
- Test with color-blind simulators

## Canvas Drawing

The `MeasurementCanvas` component handles:
- Image rendering
- Line drawing (mouse and touch)
- Intersection calculation
- Coordinate conversion

### Drawing Logic

1. User clicks/touches to start line
2. Mouse/touch move updates preview
3. Release completes line
4. Intersections calculated on line completion
5. Coordinates converted to millimeters based on paper size

## Paper Size System

Paper sizes defined in `src/utils/paperSizes.ts`:
- A5: 148 × 210 mm (default)
- A6: 105 × 148 mm
- A4: 210 × 297 mm
- US Letter: 215.9 × 279.4 mm

Coordinate conversion scales image to fit paper size while maintaining aspect ratio.

## Image Processing

Image filters applied via canvas pixel manipulation:
- Grayscale conversion
- Brightness adjustment (0-200%)
- Contrast adjustment (0-200%)

Filters are applied in real-time as user adjusts sliders.

## State Management

- Local component state with Preact hooks
- Theme preferences in localStorage
- No global state management library (keep it simple)

## File Organization

```
src/
├── components/          # Preact components
│   ├── MeasurementCanvas.tsx
│   ├── ImageUpload.tsx
│   └── ...
├── layouts/            # Astro layouts
├── pages/              # Astro pages (routes)
├── types/              # TypeScript types
└── utils/              # Pure utility functions
    ├── paperSizes.ts
    ├── theme.ts
    ├── math.ts
    └── imageFilters.ts
```

## Common Tasks

### Adding a New Paper Size

1. Add to `PaperSize` type in `src/types/index.ts`
2. Add dimensions to `PAPER_SIZES` in `src/utils/paperSizes.ts`
3. Add label to `PAPER_LABELS` in `PaperSizeSelector.tsx`

### Adding a New Image Filter

1. Add property to `ImageAdjustments` type
2. Implement filter logic in `src/utils/imageFilters.ts`
3. Add UI control in `ImageAdjustments.tsx`
4. Apply filter in `MeasurementCanvas.tsx`

### Adding Keyboard Navigation

- Use `onKeyDown` handlers
- Provide visible focus indicators
- Support Tab, Enter, Escape, Arrow keys
- Document keyboard shortcuts

## Testing Considerations

- Test on mobile devices (touch events)
- Test with keyboard only
- Test with screen readers
- Test color-blind accessibility
- Test with various image sizes
- Verify Lighthouse scores remain high

## Performance Optimization

- Lazy load components when possible
- Minimize re-renders
- Use `useMemo` for expensive calculations
- Debounce slider inputs
- Optimize canvas redraws

## Commit Messages

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Tests
- `chore:` Maintenance

## Questions?

When in doubt:
1. Check existing code patterns
2. Follow Preact best practices
3. Prioritize accessibility
4. Optimize for performance
5. Keep it simple
