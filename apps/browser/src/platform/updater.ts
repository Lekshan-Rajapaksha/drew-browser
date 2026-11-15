import { IS_MACOS } from "./platformInfo";
import {
  updaterState as macUpdaterState,
  checkForUpdates as macCheckForUpdates,
  setAutomaticUpdateChecks as macSetAutomaticUpdateChecks,
  setAutomaticUpdateDownloads as macSetAutomaticUpdateDownloads,
  setUpdateChannel as macSetUpdateChannel,
} from "./app";
import type { UpdateChannel, UpdaterState } from "./app";

export const updaterState = (): UpdaterState => {
  if (IS_MACOS) {
    return macUpdaterState();
  }
  return "idle" as UpdaterState;
};

export const checkForUpdates = () => {
  if (IS_MACOS) {
    return macCheckForUpdates();
  }
};

export const setAutomaticUpdateChecks = (on: boolean) => {
  if (IS_MACOS) {
    return macSetAutomaticUpdateChecks(on);
  }
};

export const setAutomaticUpdateDownloads = (on: boolean) => {
  if (IS_MACOS) {
    return macSetAutomaticUpdateDownloads(on);
  }
};

export const setUpdateChannel = (channel: UpdateChannel) => {
  if (IS_MACOS) {
    return macSetUpdateChannel(channel);
  }
};

