import * as path from 'path';
import * as os from 'os';
import type { BrowserSource } from '../index';

export function getChromeLinuxSource(): BrowserSource {
  const profileDir = path.join(os.homedir(), '.config', 'google-chrome');
  return {
    id: 'chrome-linux',
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

