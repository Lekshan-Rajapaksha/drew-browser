import * as path from 'path';
import * as os from 'os';
import type { BrowserSource } from '../index';

export function getFirefoxLinuxSource(): BrowserSource {
  const profileDir = path.join(os.homedir(), '.mozilla', 'firefox');
  return {
    id: 'firefox-linux',
    name: 'Mozilla Firefox',
    family: 'firefox',
    appPath: profileDir,
    requiresExport: false,
    needsKeychain: false,
    profiles: [
      {
        id: 'default',
        name: 'Default',
        path: profileDir,
        isDefault: true,
        available: ['bookmarks', 'history', 'passwords'],
      },
    ],
  };
}

