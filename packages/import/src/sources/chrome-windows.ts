import * as path from 'path';
import type { BrowserSource } from '../index';

export function getChromeWindowsSource(): BrowserSource {
  const localAppData = process.env.LOCALAPPDATA || '';
  const profileDir = path.join(localAppData, 'Google', 'Chrome', 'User Data');
  return {
    id: 'chrome-windows',
    name: 'Google Chrome',
    family: 'chromium',
    appPath: profileDir,
    requiresExport: false,
    needsKeychain: false,
    profiles: [
      {
        id: 'Default',
        name: 'Default',
        path: path.join(profileDir, 'Default'),
        isDefault: true,
        available: ['bookmarks', 'history', 'passwords', 'autofill'],
      },
    ],
  };
}

