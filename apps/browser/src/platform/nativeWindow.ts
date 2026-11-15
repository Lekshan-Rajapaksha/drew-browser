import { IS_MACOS } from "./platformInfo";
import * as macWindows from "./windows";
import type { OpenWindowOptions, WindowEvent } from "./windows";

export const openWindow = (id: string, options: OpenWindowOptions = {}) => {
  if (IS_MACOS) {
    return macWindows.openWindow(id, options);
  }
  return Promise.resolve();
};

export const closeWindow = (id: string) => {
  if (IS_MACOS) {
    return macWindows.closeWindow(id);
  }
};

export const focusWindow = (id: string) => {
  if (IS_MACOS) {
    return macWindows.focusWindow(id);
  }
};

export const setWindowTitle = (id: string, title: string) => {
  if (IS_MACOS) {
    return macWindows.setWindowTitle(id, title);
  }
};

export const windowCornerRadius = () => {
  if (IS_MACOS) {
    return macWindows.windowCornerRadius();
  }
  return 0;
};

export const onWindowEvent = (listener: (e: WindowEvent) => void) => {
  if (IS_MACOS) {
    return macWindows.onWindowEvent(listener);
  }
  return { remove: () => {} };
};

