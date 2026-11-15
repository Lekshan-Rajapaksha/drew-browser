import * as path from 'path';
import type { BrowserSource } from '../index';

export function getEdgeWindowsSource(): BrowserSource {
  const localAppData = process.env.LOCALAPPDATA || '';
  const profileDir = path.join(localAppData, 'Microsoft', 'Edge', 'User Data');
  return {
    id: 'edge-windows',
    name: 'Microsoft Edge',
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

