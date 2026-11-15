import type { WindowManager, MenuManager, CredentialStore, Updater, AppBadge } from '../types';

export const windowManager: WindowManager = {
  async openWindow() { return 'window-1'; },
  async closeWindow() {},
  async focusWindow() {},
  async setWindowTitle() {},
  async windowCornerRadius() {},
  onWindowEvent() { return () => {}; },
};

export const menuManager: MenuManager = {
  setMainMenu() {},
  addMenuItem() {},
};

export const credentialStore: CredentialStore = {
  async get() { return null; },
  async set() {},
  async delete() {},
};

export const updater: Updater = {
  async checkForUpdates() {},
  updaterState() { return 'idle'; },
  setUpdateChannel() {},
};

export const appBadge: AppBadge = {
  set() {},
  clear() {},
};

