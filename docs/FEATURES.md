# MeasureOver - Feature Documentation

## Overview
MeasureOver is a fast, lightweight, client-only web application for image measurement and drawing guidance. It allows users to upload images, draw measurement lines, and export annotated images at specific paper sizes.

## Core Features

### 1. Image Upload and Display
- **Drag-and-drop** image upload
- **File picker** alternative
- Supports common image formats (JPEG, PNG, WebP, etc.)
- Automatic canvas sizing to match image dimensions
- Responsive display with maximum height constraints

### 2. Measurement Lines
- **Draw Mode**: Click and drag to create measurement lines
- **Move Mode**: Click and drag existing lines to reposition them
- **Delete Mode**: Click on lines to delete them
- Lines automatically extend to canvas edges
- Line snapping to horizontal/vertical axes (configurable)
- Visual feedback with hover states and snap indicators

#### Line Drawing Behavior
- Lines are drawn from start point to end point
- Automatically extended to canvas boundaries for full visibility
- Snapping threshold: 5 pixels (configurable)
- Minimum line length: 5 pixels to prevent accidental clicks

#### Line Movement
- Click and drag to move lines while maintaining orientation
- Touch devices: Long press (200ms) required to prevent accidental moves
- Hit detection threshold: 15 pixels
- Visual highlight when hovering over movable lines

### 3. Grid Overlay
- Toggleable grid overlay
- Automatic spacing calculation based on image dimensions
- Adjustable opacity (0-100%, default: 10%)
- Theme-aware colors (black for light mode, white for dark mode)
- Grid spacing: ~5% of smaller image dimension (minimum 20px)

### 4. Coordinate Display
- Real-time intersection point calculation
- Displays coordinates in selected measurement unit
- Responsive grid layout for multiple points
- Prominent display below canvas
- Paper size-based coordinate scaling

### 5. Paper Size Selection
Supported paper sizes:
- **A Series**: A6, A5, A4, A3, A2, A1, A0
- **US Series**: Letter (8.5 × 11 in), Legal (8.5 × 14 in), Tabloid (11 × 17 in)

Coordinates are automatically scaled to match selected paper size dimensions.

### 6. Measurement Units
- **Millimeters (mm)**: Default metric unit
- **Centimeters (cm)**: Metric unit (1 cm = 10 mm)
- **Inches (in)**: Imperial unit (1 in = 25.4 mm)

All coordinates are converted and displayed in the selected unit.

### 7. Image Adjustments

#### Grayscale Filter
- Toggle to convert image to grayscale
- Uses standard luminance formula: `0.299*R + 0.587*G + 0.114*B`

#### Brightness Control
- Range: 0-200% (100% = normal)
- Multiplicative brightness adjustment
- Applied to RGB channels independently

#### Contrast Control
- Range: 0-200% (100% = normal)
- Contrast adjustment around midpoint (128)
- Formula: `value + (contrast - 100) / 100 * 128`

#### Rotation
- Range: 0-360 degrees
- Quick buttons: -90°, +90°, Reset
- Canvas-based rotation (may require canvas resize for proper display)

#### Crop (Basic)
- Toggle to enable/disable crop
- Percentage-based crop coordinates
- Note: Basic implementation; advanced cropping may require pre-processing

### 8. Undo/Redo System
- **Undo**: Ctrl+Z (Cmd+Z on Mac)
- **Redo**: Ctrl+Y or Ctrl+Shift+Z
- Button-based controls in toolbar
- History limit: 50 states
- Deep cloning for state management

### 9. Project Management
- **Save Project**: Stores current state to localStorage
  - Lines, paper size, adjustments, grid settings, unit
  - Timestamp and auto-generated name
  - Maximum 10 saved projects
- **Load Project**: Restore saved project state
- **Delete Project**: Remove saved projects
- Projects persist across browser sessions

### 10. Image Export
- **Export with Overlays**: Image + lines + grid + intersection points
- **Paper Size Scaling**: Exports at selected paper size dimensions
- **DPI**: 300 DPI for print quality
- **Format**: PNG
- **Aspect Ratio**: Maintained with white background fill
- **Filename**: Includes paper size and timestamp

#### Export Process
1. Calculate target dimensions based on paper size (300 DPI)
2. Scale image to fit while maintaining aspect ratio
3. Apply all image adjustments (filters, rotation, crop)
4. Scale lines and grid proportionally
5. Draw grid overlay (if enabled)
6. Draw measurement lines (extended to edges)
7. Draw intersection points
8. Export as PNG

### 11. Theme Support
- **Light Mode**: Default theme
- **Dark Mode**: Dark background with light text
- **High Contrast**: Enhanced contrast variant
- System preference detection
- Manual toggle
- Persistent storage

### 12. Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader support
- **Color Blind Friendly**: Blue lines (#0066cc) instead of red/orange
- **Focus Indicators**: Visible focus rings
- **Touch Support**: Mobile-friendly with long-press detection

## Technical Architecture

### State Management
- React/Preact hooks for component state
- Local state for UI interactions
- Undo/redo manager for history
- LocalStorage for persistence

### Canvas Rendering
- HTML5 Canvas API for image rendering
- Pixel manipulation for filters
- Context transformations for rotation
- Efficient redraw on state changes

### Coordinate System
- Canvas coordinates (pixels)
- Paper size conversion (mm/cm/inches)
- Scale factor calculation based on aspect ratio
- Intersection point calculation using line equations

### Line Mathematics
- Line extension to canvas edges
- Point-to-line distance calculation
- Line intersection detection
- Axis snapping algorithm

### Performance Optimizations
- Debounced slider inputs (100ms)
- Efficient canvas redraws
- Minimal re-renders
- Optimized intersection calculations

## Browser Compatibility
- Modern browsers with Canvas API support
- ES6+ JavaScript features
- CSS Grid and Flexbox
- LocalStorage API

## File Structure
```
src/
├── components/          # React/Preact components
│   ├── MeasurementCanvas.tsx    # Main canvas component
│   ├── ImageUpload.tsx          # Image upload handler
│   ├── CoordinateDisplay.tsx    # Coordinate display
│   ├── GridControls.tsx         # Grid settings
│   ├── ImageAdjustments.tsx     # Image filter controls
│   ├── PaperSizeSelector.tsx    # Paper size selector
│   ├── UnitSelector.tsx         # Measurement unit selector
│   ├── ProjectManager.tsx       # Save/load projects
│   └── ThemeToggle.tsx          # Theme switcher
├── utils/              # Utility functions
│   ├── grid.ts                  # Grid calculations
│   ├── imageFilters.ts          # Image processing
│   ├── imageExport.ts           # Export functionality
│   ├── lineExtension.ts         # Line edge extension
│   ├── lineHitDetection.ts      # Line interaction
│   ├── math.ts                  # Geometric calculations
│   ├── paperSizes.ts            # Paper size definitions
│   ├── projectStorage.ts       # LocalStorage management
│   ├── theme.ts                # Theme management
│   ├── undoRedo.ts             # Undo/redo system
│   └── units.ts                # Unit conversions
├── types/              # TypeScript type definitions
└── pages/              # Astro pages
```

## API Reference

### Core Functions

#### `applyImageFilters(canvas, adjustments, sourceImage?)`
Applies image filters (grayscale, brightness, contrast, rotation, crop) to canvas.

#### `exportImageWithLines(image, lines, adjustments, gridSettings, paperSize)`
Exports image with measurement lines and grid overlay at specified paper size.

#### `snapToAxis(start, end, threshold?, enabled?)`
Snaps line end point to horizontal or vertical if within threshold.

#### `extendLineToEdges(line, canvasWidth, canvasHeight)`
Extends line to canvas boundaries using line equations.

#### `findLineAtPoint(point, lines, canvasWidth, canvasHeight)`
Finds line at given point using distance calculation.

#### `findAllIntersections(lines)`
Calculates all intersection points between lines.

## Configuration

### Grid Settings
```typescript
interface GridSettings {
  enabled: boolean;
  opacity: number;    // 0-100
  spacing: number;    // pixels (auto-calculated)
}
```

### Image Adjustments
```typescript
interface ImageAdjustments {
  grayscale: boolean;
  brightness: number;  // 0-200, 100 = normal
  contrast: number;   // 0-200, 100 = normal
  rotation: number;    // 0-360 degrees
  crop: {
    enabled: boolean;
    x: number;         // 0-100, percentage
    y: number;         // 0-100, percentage
    width: number;     // 0-100, percentage
    height: number;    // 0-100, percentage
  };
}
```

## Future Enhancements
- Advanced crop tool with visual handles
- More image filters (saturation, hue, etc.)
- Line style options (dashed, dotted)
- Measurement annotations (text labels)
- Export formats (PDF, SVG)
- Cloud storage integration
- Collaborative editing
- Measurement templates
- Custom paper sizes
