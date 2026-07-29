/**
 * Touch-device detection.
 *
 * Deliberately NOT a user-agent sniff. iPadOS 13+ reports a Macintosh UA, so
 * `/iPhone|iPad|iPod|Android/` misses every iPad and hands tablets the desktop
 * defaults (thin lines, small hit targets) on a touch screen.
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) {
    return true;
  }
  return typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;
}

/** True when the device can actually hover — hover-only hints are useless without it. */
export function canHover(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(hover: hover)').matches;
}
