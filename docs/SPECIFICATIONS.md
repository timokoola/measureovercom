# MeasureOver Specifications

## Overview

MeasureOver is a web application that allows users to upload images and draw measurement lines on top of them. The tool calculates and displays coordinates of line intersections in millimeters, scaled to a selected paper size. This helps users create accurate drawings by providing measurement guidance.

## Core Features

### Image Upload
- Drag and drop image files
- File picker for image selection
- Support for common image formats (JPEG, PNG, WebP, etc.)
- Client-side image processing (no server upload)

### Measurement Drawing
- Draw lines by clicking and dragging
- Visual feedback during line drawing (dashed preview)
- Support for mouse and touch input
- Clear all lines button
- Lines persist until cleared

### Coordinate Display
- Calculate intersections of all drawn lines
- Display coordinates in millimeters
- Scale coordinates based on selected paper size
- Show all intersection points in a scrollable list

### Paper Size Selection
- A5 (148 × 210 mm) - Default
- A6 (105 × 148 mm)
- A4 (210 × 297 mm)
- US Letter (215.9 × 279.4 mm)
- Coordinates scale proportionally to fit paper size

### Image Adjustments
- Grayscale conversion (toggle)
- Brightness adjustment (0-200%)
- Contrast adjustment (0-200%)
- Real-time preview of adjustments

### Theme System
- Light mode (default)
- Dark mode
- High contrast mode for accessibility
- Theme preference stored in localStorage
- Respects system preference on first visit

## Technical Requirements

### Performance
- Lighthouse score target: 90+
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Minimal JavaScript bundle size
- Optimized canvas rendering

### Accessibility
- WCAG AA compliance
- Keyboard navigation support
- Screen reader friendly
- Color-blind accessible (don't rely on red/green)
- Focus indicators visible
- Semantic HTML

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
- No polyfills required for core features

### Design Requirements
- Minimal, clean interface
- Color palette: broken white, black, burnt orange
- Responsive design (mobile-first)
- Touch-friendly controls
- Clear visual hierarchy

## User Flow

1. User visits site
2. User uploads image (drag-drop or file picker)
3. Image displays in canvas
4. User selects paper size (default: A5)
5. User draws lines on image
6. Intersection coordinates appear in sidebar
7. User can adjust image (grayscale, brightness, contrast)
8. User can change theme
9. User can clear lines and start over
10. User can upload different image

## Data Flow

### State Management
- Component-level state with Preact hooks
- Theme preferences in localStorage
- No global state management needed

### Coordinate Calculation
1. Lines stored as start/end points in pixel coordinates
2. Intersections calculated using line-line intersection algorithm
3. Pixel coordinates converted to millimeters based on:
   - Image dimensions
   - Selected paper size
   - Aspect ratio preservation

### Image Processing
- Canvas-based pixel manipulation
- Filters applied in real-time
- No external image processing libraries

## Future Extensibility

The architecture supports adding:
- Additional paper sizes
- More image filters (rotation, crop, etc.)
- Export functionality (PNG, PDF)
- Line editing (move, delete individual lines)
- Measurement units (inches, cm)
- Grid overlay
- Snap-to-grid functionality
- Undo/redo
- Save/load projects

## Constraints

- Client-only (no backend)
- No user accounts
- No data persistence (except theme preference)
- No image storage
- Works offline after initial load

## Success Metrics

- Fast load time
- Smooth drawing experience
- Accurate coordinate calculations
- High accessibility score
- Positive user feedback
- Low bounce rate
