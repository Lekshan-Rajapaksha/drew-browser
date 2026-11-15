import * as ShellFiles from "@ardia/shell";
import { Linking } from "react-native";
import { IS_MACOS } from "./platformInfo";

export const fileExists = (path: string): boolean => {
  try {
    const res = ShellFiles.fileExists(path);
    if (typeof res === "boolean") return res;
  } catch {
  }
  return false;
};

export const openFile = async (path: string): Promise<boolean> => {
  try {
    const res = await ShellFiles.openFile(path);
    if (typeof res === "boolean") return res;
  } catch {
  }
  try {
    const target = path.startsWith("file://") ? path : `file://${path}`;
    await Linking.openURL(target);
    return true;
  } catch {
    return false;
  }
};

export const revealFile = async (path: string): Promise<boolean> => {
  try {
    const res = await ShellFiles.revealFile(path);
    if (typeof res === "boolean") return res;
  } catch {
  }
  return false;
};

export const moveToTrash = async (path: string): Promise<boolean> => {
  try {
    const res = await ShellFiles.moveToTrash(path);
    if (typeof res === "boolean") return res;
  } catch {
  }
  return false;
};

export const fileIcon = async (path: string, size = 32): Promise<string | null> => {
  try {
    const res = await ShellFiles.fileIcon(path, size);
    if (typeof res === "string") return res;
  } catch {
  }
  return null;
};

export const runningAppIcon = async (pid: number, size = 32): Promise<string | null> => {
  try {
    const res = await ShellFiles.runningAppIcon(pid, size);
    if (typeof res === "string") return res;
  } catch {
  }
  return null;
};
