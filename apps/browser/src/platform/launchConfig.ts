import { nativeModule, type LaunchConfig } from "@ardia/shell";
import { IS_WINDOWS, IS_LINUX } from "./platformInfo";

const defaultDirectory = (): string => {
  if (typeof process !== "undefined" && process.env) {
    if (IS_WINDOWS) {
      return (process.env.APPDATA ? process.env.APPDATA + "\\Ardia" : "") || (process.env.USERPROFILE ? process.env.USERPROFILE + "\\AppData\\Roaming\\Ardia" : "C:\\Ardia");
    }
    if (IS_LINUX) {
      return (process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME + "/ardia" : "") || (process.env.HOME ? process.env.HOME + "/.config/ardia" : "/home/ardia/.config/ardia");
    }
    if (process.env.HOME) {
      return process.env.HOME + "/Library/Application Support/com.ardia.browser";
    }
  }
  return "";
};

const defaultConfig: LaunchConfig = {
  dataDirectory: null,
  configDirectory: defaultDirectory(),
  background: false,
  isolated: false,
  testInstance: false,
  instance: {},
  switches: {},
  trace: [],
  test: {},
  feedbackURL: null,
};

let config: LaunchConfig | null = null;

const resolveConfig = (): LaunchConfig => {
  try {
    const raw = nativeModule("ArdiaApp").launchConfig();
    if (raw && typeof raw === "object" && typeof raw.configDirectory === "string") {
      return {
        ...defaultConfig,
        ...raw,
        switches: raw.switches || {},
        instance: raw.instance || {},
        test: raw.test || {},
        trace: raw.trace || [],
      };
    }
  } catch {
  }
  return defaultConfig;
};

const current = (): LaunchConfig => (config ??= resolveConfig());

export const configDirectory = (): string => current().configDirectory;

export const isTestInstance = (): boolean => current().testInstance;

export const feedbackURLOverride = (): string | null => current().feedbackURL ?? null;

export const switchOverride = (name: string): boolean | undefined => current().switches?.[name];

const testValue = (key: string): string | null => current().test?.[key] ?? null;

export const devTestValue = (key: string): string | null => (typeof __DEV__ !== "undefined" && __DEV__ ? testValue(key) : null);

export const reloadLaunchConfigForTests = () => void (config = null);
