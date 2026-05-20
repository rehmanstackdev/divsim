/**
 * Helper utilities for DevSim Responsive Simulator
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateDeviceId(): string {
  return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

export function getDeviceScale(
  deviceWidth: number,
  deviceHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding = 80
): number {
  const availableWidth = containerWidth - padding;
  const availableHeight = containerHeight - padding;
  const scaleX = availableWidth / deviceWidth;
  const scaleY = availableHeight / deviceHeight;
  return Math.min(scaleX, scaleY, 1.5);
}

export const SAMPLE_URLS = [
  { label: 'Example.com', url: 'https://example.com' },
  { label: 'Google', url: 'https://google.com' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { label: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { label: 'CSS-Tricks', url: 'https://css-tricks.com' },
];