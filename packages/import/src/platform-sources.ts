import type { BrowserSource } from './index';
import { getEdgeWindowsSource } from './sources/edge-windows';
import { getChromeWindowsSource } from './sources/chrome-windows';
import { getChromeLinuxSource } from './sources/chrome-linux';
import { getChromiumLinuxSource } from './sources/chromium-linux';
import { getFirefoxLinuxSource } from './sources/firefox-linux';

export function getPlatformSources(): BrowserSource[] {
  const p = typeof process !== 'undefined' ? process.platform : 'darwin';
  if (p === 'win32') {
    return [getEdgeWindowsSource(), getChromeWindowsSource()];
  } else if (p === 'linux') {
    return [getChromeLinuxSource(), getChromiumLinuxSource(), getFirefoxLinuxSource()];
  }
  return [];
}

