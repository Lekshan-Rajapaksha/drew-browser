export type Platform = 'macos' | 'windows' | 'linux';

export type WindowEventType =
  | 'focus'
  | 'blur'
  | 'close'
  | 'minimize'
  | 'maximize'
  | 'restore'
  | 'resize'
  | 'move';

export interface WindowEvent {
  type: WindowEventType;
  windowId: string;
}

export interface OpenWindowOptions {
  title?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  url?: string;
}

export interface WindowManager {
  openWindow(options?: OpenWindowOptions): Promise<string>;
  closeWindow(windowId: string): Promise<void>;
  focusWindow(windowId: string): Promise<void>;
  setWindowTitle(windowId: string, title: string): Promise<void>;
  windowCornerRadius(windowId: string, radius: number): Promise<void>;
  onWindowEvent(handler: (event: WindowEvent) => void): () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  accelerator?: string;
  enabled?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
}

export interface MenuManager {
  setMainMenu(items: MenuItem[]): void;
  addMenuItem(parentId: string | null, item: MenuItem): void;
}

export interface CredentialStore {
  get(account: string): Promise<string | null>;
  set(account: string, secret: string): Promise<void>;
  delete(account: string): Promise<void>;
}

export type UpdaterState = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'error';

export type UpdateChannel = 'stable' | 'beta' | 'nightly';

export interface Updater {
  checkForUpdates(): Promise<void>;
  updaterState(): UpdaterState;
  setUpdateChannel(channel: UpdateChannel): void;
}

export interface AppBadge {
  set(count: number): void;
  clear(): void;
}
