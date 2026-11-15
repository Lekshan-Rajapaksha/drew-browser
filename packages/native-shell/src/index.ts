export * from './types';

import type { WindowManager, MenuManager, CredentialStore, Updater, AppBadge } from './types';
import * as macos from './macos';
import * as windows from './windows';
import * as linux from './linux';

export function getPlatformShell(): {
  windowManager: WindowManager;
  menuManager: MenuManager;
  credentialStore: CredentialStore;
  updater: Updater;
  appBadge: AppBadge;
} {
  const p = typeof process !== 'undefined' ? process.platform : 'darwin';
  if (p === 'win32') {
    return windows;
  } else if (p === 'linux') {
    return linux;
  }
  return macos;
}

