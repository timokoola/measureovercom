# MeasureOver - User Guide

## Getting Started

MeasureOver is a web-based tool for measuring and annotating images. No installation required - just open the website and start using it!

### Uploading an Image

1. **Drag and Drop**: Simply drag an image file from your computer onto the upload area
2. **File Picker**: Click the upload area to open a file picker and select an image
3. **Supported Formats**: JPEG, PNG, WebP, and other common image formats

## Drawing Measurement Lines

### Drawing Lines

1. Make sure you're in **Draw mode** (selected by default)
2. Click and hold where you want the line to start
3. Drag to where you want the line to end
4. Release to complete the line

**Tips:**
- Lines automatically extend to the edges of the image
- Lines snap to horizontal or vertical when you're close (within 5 pixels)
- Hold **Shift** while drawing to disable snapping for diagonal lines
- An orange dot appears when snapping is active

### Moving Lines

1. Click the **Move** button in the toolbar
2. Hover over a line - it will highlight in blue
3. Click and drag the line to reposition it
4. Release to place it in the new position

**On Mobile:**
- Long press (hold for 200ms) on a line, then drag to move it

### Deleting Lines

1. Click the **Delete** button in the toolbar
2. Hover over a line - it will highlight in red
3. Click on the line to delete it

## Understanding Coordinates

When you draw two or more lines, **intersection points** are automatically calculated and displayed below the canvas.

### Coordinate Display

- Each intersection point shows X and Y coordinates
- Coordinates are displayed in your selected measurement unit
- Coordinates are scaled to match your selected paper size

### Paper Sizes

Select a paper size to scale coordinates accordingly:
- **A Series**: A6, A5, A4, A3, A2, A1, A0
- **US Series**: Letter, Legal, Tabloid

### Measurement Units

Choose your preferred unit:
- **Millimeters (mm)**: Default metric unit
- **Centimeters (cm)**: 1 cm = 10 mm
- **Inches (in)**: Imperial unit

## Grid Overlay

The grid helps with alignment and measurement:

1. **Enable Grid**: Check the "Show Grid" checkbox
2. **Adjust Opacity**: Use the slider to make the grid more or less visible (0-100%)
3. **Grid Spacing**: Automatically calculated based on image size

The grid is especially useful when:
- Drawing parallel lines
- Aligning measurements
- Checking proportions

## Image Adjustments

### Grayscale
Convert your image to black and white by checking the "Grayscale" checkbox.

### Brightness
Adjust image brightness:
- **0%**: Completely black
- **100%**: Normal brightness (default)
- **200%**: Maximum brightness

### Contrast
Adjust image contrast:
- **0%**: No contrast (gray)
- **100%**: Normal contrast (default)
- **200%**: Maximum contrast

### Rotation
Rotate your image:
- Use the slider to rotate 0-360 degrees
- Quick buttons: **-90°**, **+90°**, **Reset**
- Useful for correcting orientation

### Crop (Basic)
Basic crop functionality is available, but for advanced cropping, consider editing your image before uploading.

## Keyboard Shortcuts

- **Ctrl+Z** (Cmd+Z on Mac): Undo last action
- **Ctrl+Y** (Cmd+Y on Mac): Redo last action
- **Shift**: Hold while drawing to disable snapping
- **Escape**: Clear all lines or cancel drawing

## Saving and Loading Projects

### Save Your Work

1. Click **"Save Current Project"** in the sidebar
2. Your project is automatically saved with a timestamp
3. Projects are stored in your browser (localStorage)

**What Gets Saved:**
- All measurement lines
- Paper size selection
- Image adjustments
- Grid settings
- Measurement unit

### Load a Saved Project

1. Click **"Show"** next to Projects in the sidebar
2. Click on a saved project to load it
3. Your image and all settings will be restored

### Delete Projects

1. Hover over a saved project
2. Click the **X** button that appears
3. Confirm deletion

**Note**: Projects are stored locally in your browser. Clearing browser data will delete saved projects.

## Exporting Images

Export your annotated image:

1. Click **"Export Image"** button
2. The image will be downloaded as a PNG file
3. The exported image includes:
   - Your original image (with adjustments)
   - All measurement lines
   - Grid overlay (if enabled)
   - Intersection points

### Export Settings

- **Paper Size**: The exported image will be sized to match your selected paper size
- **Resolution**: 300 DPI (print quality)
- **Format**: PNG
- **Aspect Ratio**: Maintained with white background if needed

**Use Cases:**
- Print at exact paper size
- Share annotated images
- Document measurements
- Create reference images

## Theme Options

Switch between light and dark themes:

1. Click the theme toggle in the top right
2. Choose from:
   - **Light**: Default light theme
   - **Dark**: Dark background for low-light environments
   - **High Contrast**: Enhanced contrast for accessibility

Your theme preference is saved automatically.

## Tips and Best Practices

### For Accurate Measurements

1. **Use High-Resolution Images**: Higher resolution = more accurate measurements
2. **Enable Grid**: Helps with alignment and precision
3. **Use Appropriate Paper Size**: Match the paper size to your actual print size
4. **Check Units**: Make sure you're using the correct unit (mm/cm/inches)

### For Drawing Guidance

1. **Snap to Grid**: Use snapping for straight horizontal/vertical lines
2. **Disable Snapping**: Hold Shift for diagonal or free-form lines
3. **Multiple Lines**: Draw multiple lines to see intersection points
4. **Move Lines**: Fine-tune line positions in Move mode

### Performance Tips

1. **Large Images**: Very large images may take longer to process
2. **Many Lines**: Having many lines may slow down rendering
3. **Browser**: Use a modern browser for best performance

## Troubleshooting

### Image Won't Upload
- Check file format (JPEG, PNG, WebP supported)
- Try a smaller file size
- Check browser console for errors

### Lines Not Appearing
- Make sure you're in Draw mode
- Check that you're clicking on the image area
- Try refreshing the page

### Coordinates Seem Wrong
- Verify your paper size selection
- Check your measurement unit
- Make sure the image fills the canvas properly

### Export Looks Different
- Grid and lines are scaled to paper size
- White background is added if aspect ratios don't match
- Check that all settings are correct before exporting

### Can't Move Lines
- Make sure you're in Move mode
- On mobile, use long press (200ms)
- Try increasing the hit detection threshold

## Browser Compatibility

MeasureOver works best in:
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Supported with touch gestures

## Privacy and Data

- **No Server Upload**: All processing happens in your browser
- **Local Storage**: Projects are stored locally on your device
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Code is available for review

## Getting Help

If you encounter issues:
1. Check this guide for common solutions
2. Try refreshing the page
3. Clear browser cache if problems persist
4. Check browser console for error messages

## Feature Requests

MeasureOver is actively developed. Feature requests and bug reports are welcome through the project's issue tracker.
